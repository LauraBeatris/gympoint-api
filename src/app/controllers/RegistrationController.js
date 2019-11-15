import Joi from 'joi';
import { parseISO, addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';
import validationSchema from '../../validationSchemas/registrations';

class RegistrationController {
  async store(req, res) {
    Joi.validate(req.body, validationSchema.store, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    // Registration input data
    const { student_id, plan_id } = req.body;
    let { start_date } = req.body;

    // Finding for the choosed plan
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ err: 'Plan not found' });
    }

    const { price: planPrice, duration } = plan;

    // Generating the end date and the price based on the choosed plan
    start_date = parseISO(start_date);
    const end_date = addMonths(start_date, duration);
    const price = planPrice * duration;

    // Verifying if the user already have a registration
    const existingRegistration = await Registration.findOne({
      where: { student_id },
    });

    if (existingRegistration) {
      return res.status(401).json({
        err:
          'This user already have a registration. Update the current one or delete',
      });
    }
    const { id } = await Registration.create({
      start_date,
      end_date,
      price,
      plan_id,
      student_id,
    });

    const student = await Student.findByPk(student_id);

    Queue.add(RegistrationMail.key, {
      start_date,
      end_date,
      price,
      plan,
      student,
    });

    return res.json({ id, start_date, end_date, price, plan, student_id });
  }

  async update(req, res) {
    Joi.validate(req.body, validationSchema.update, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    const { registration_id } = req.params;

    // Validating param
    if (!registration_id) {
      return res.status(400).json({ err: 'Registration id not provided' });
    }

    // Finding the registration
    const registration = await Registration.findByPk(registration_id);

    if (!registration) {
      return res.status(404).json({ err: 'Registration not found' });
    }

    // If the plan was changed, it needs to change the price and date informations
    if (!!req.body.plan_id && req.body.plan_id !== registration.plan_id) {
      const { duration, price } = await Plan.findByPk(req.body.plan_id);
      req.body.price = duration * price;
      req.body.end_date = addMonths(registration.start_date, duration);
    }

    // Updating and saving
    const {
      id,
      plan_id,
      start_date,
      end_date,
      price,
      student_id,
    } = await registration.update(req.body);
    await registration.save();

    return res.json({
      id,
      start_date,
      end_date,
      price,
      plan_id,
      student_id,
    });
  }

  async delete(req, res) {
    const { registration_id } = req.params;

    // Validating param
    if (!registration_id) {
      return res.status(400).json({ err: 'Registration id not provided' });
    }

    // Finding the registration
    const registration = await Registration.findByPk(registration_id);

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Deleting the plan
    await registration.destroy();

    return res.json({
      msg: `Registration with id ${registration.id} was successfully deleted`,
    });
  }

  async index(req, res) {
    const { page = 1, start_date, end_date, price, plan_id } = req.query;

    const query = {};

    // Conditionally building the query object
    if (start_date) query.start_date = start_date;
    if (end_date) query.end_date = end_date;
    if (price) query.price = price;
    if (plan_id) query.plan_id = plan_id;

    const registrations = await Registration.findAll({
      where: { ...query },
      offset: (page - 1) * 10,
      limit: 10,
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'price', 'duration'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'height', 'weight'],
        },
      ],
    });

    return res.json(registrations);
  }
}

export default new RegistrationController();
