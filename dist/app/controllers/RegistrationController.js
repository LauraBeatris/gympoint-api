"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _datefns = require('date-fns');
var _Registration = require('../models/Registration'); var _Registration2 = _interopRequireDefault(_Registration);
var _Student = require('../models/Student'); var _Student2 = _interopRequireDefault(_Student);
var _Plan = require('../models/Plan'); var _Plan2 = _interopRequireDefault(_Plan);

var _Queue = require('../../lib/Queue'); var _Queue2 = _interopRequireDefault(_Queue);
var _RegistrationMail = require('../jobs/RegistrationMail'); var _RegistrationMail2 = _interopRequireDefault(_RegistrationMail);
var _registrations = require('../../validationSchemas/registrations'); var _registrations2 = _interopRequireDefault(_registrations);

class RegistrationController {
  async store(req, res) {
    _joi2.default.validate(req.body, _registrations2.default.store, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    // Registration input data
    const { student_id, plan_id } = req.body;
    let { start_date } = req.body;

    // Finding for the choosed plan
    const plan = await _Plan2.default.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ err: 'Plan not found' });
    }

    const { price: planPrice, duration } = plan;

    // Generating the end date and the price based on the choosed plan
    start_date = _datefns.parseISO.call(void 0, start_date);
    const end_date = _datefns.addMonths.call(void 0, start_date, duration);
    const price = planPrice * duration;

    // Verifying if the user already have a registration
    const existingRegistration = await _Registration2.default.findOne({
      where: { student_id },
    });

    if (existingRegistration) {
      return res.status(401).json({
        err:
          'This user already have a registration. Update the current one or delete',
      });
    }
    const { id } = await _Registration2.default.create({
      start_date,
      end_date,
      price,
      plan_id,
      student_id,
    });

    const student = await _Student2.default.findByPk(student_id);

    await _Queue2.default.add(_RegistrationMail2.default.key, {
      start_date: _datefns.format.call(void 0, start_date, "'At day' dd 'of' MMMM',' H:mm 'hours'"),
      end_date: _datefns.format.call(void 0, end_date, "'At day' dd 'of' MMMM',' H:mm 'hours'"),
      price,
      plan,
      student,
    });

    return res.json({ id, start_date, end_date, price, plan, student_id });
  }

  async update(req, res) {
    _joi2.default.validate(req.body, _registrations2.default.update, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    const { registration_id } = req.params;

    // Validating param
    if (!registration_id) {
      return res.status(400).json({ err: 'Registration id not provided' });
    }

    // Finding the registration
    const registration = await _Registration2.default.findByPk(registration_id);

    if (!registration) {
      return res.status(404).json({ err: 'Registration not found' });
    }

    // If the plan was changed, it needs to change the price and date informations
    if (!!req.body.plan_id && req.body.plan_id !== registration.plan_id) {
      const { duration, price } = await _Plan2.default.findByPk(req.body.plan_id);
      req.body.price = duration * price;
      req.body.end_date = _datefns.addMonths.call(void 0, registration.start_date, duration);
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
    const registration = await _Registration2.default.findByPk(registration_id);

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

    const registrations = await _Registration2.default.findAll({
      where: { ...query },
      offset: (page - 1) * 10,
      limit: 10,
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: _Plan2.default,
          as: 'plan',
          attributes: ['id', 'title', 'price', 'duration'],
        },
        {
          model: _Student2.default,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'height', 'weight'],
        },
      ],
    });

    return res.json(registrations);
  }
}

exports. default = new RegistrationController();
