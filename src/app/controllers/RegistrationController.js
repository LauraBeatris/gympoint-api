import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import CreateRegistrationService from '../services/CreateRegistrationService';
import UpdateRegistrationService from '../services/UpdateRegistrationService';

class RegistrationController {
  async store(req, res) {
    // Registration input data
    const { student_id, plan_id } = req.body;
    const { start_date } = req.body;

    // Running the service responsable for the logic of creating a registration
    const registration = await CreateRegistrationService.run({
      plan_id,
      student_id,
      start_date,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const { registration_id } = req.params;

    // Validating param
    if (!registration_id) {
      return res.status(400).json({ err: 'Registration id not provided' });
    }

    const registration = await UpdateRegistrationService.run({
      registration_id,
      plan_id: req.body.plan_id,
      data: req.body,
    });

    return res.json(registration);
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

  async show(req, res) {
    const { registration_id } = req.params;

    // Validating param
    if (!registration_id) {
      return res.status(400).json({ err: 'Registration id not provided' });
    }

    // Finding the registration
    const registration = await Registration.findByPk(registration_id, {
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'height', 'weight'],
        },
      ],
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    return res.json(registration);
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
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
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
