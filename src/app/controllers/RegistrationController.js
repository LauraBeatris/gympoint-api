import Joi from 'joi';
import { parseISO, addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

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

    const { id } = await Registration.create({
      start_date,
      end_date,
      price,
      plan_id,
      student_id,
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

    // Finding the registration and updating
    const registration = await Registration.findOne({
      where: { id: registration_id },
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

    if (!registration) {
      return res.status(404).json({ err: 'Registration not found' });
    }

    const {
      id,
      start_date,
      end_date,
      price,
      plan,
      student,
    } = await registration.update(req.body);
    await registration.save();

    return res.json({
      id,
      start_date,
      end_date,
      price,
      plan,
      student,
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

  async index(req, res) {}
}

export default new RegistrationController();
