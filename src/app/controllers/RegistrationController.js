import Joi from 'joi';
import { parseISO, addMonths } from 'date-fns';
import Registration from '../models/Registration';
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

    return res.json({ id, start_date, end_date, plan, student_id });
  }

  async update(req, res) {}

  async delete(req, res) {}

  async index(req, res) {}
}

export default new RegistrationController();
