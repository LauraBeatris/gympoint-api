"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _Plan = require('../models/Plan'); var _Plan2 = _interopRequireDefault(_Plan);
var _plans = require('../../validationSchemas/plans'); var _plans2 = _interopRequireDefault(_plans);

class PlansController {
  async store(req, res) {
    _joi2.default.validate(req.body, _plans2.default.store, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    const { title, duration, price } = req.body;

    // Veryfing if there's an existing plan with the same name
    const existingPlan = await _Plan2.default.findOne({ where: { title } });

    if (existingPlan) {
      return res
        .status(400)
        .json({ err: "There's already a plan with that name" });
    }

    const { id } = await _Plan2.default.create({ title, duration, price });

    return res.json({ id, title, price, duration });
  }

  async update(req, res) {
    _joi2.default.validate(req.body, _plans2.default.store, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    // Validating param
    const { plan_id } = req.params;

    if (!plan_id) {
      return res.status(400).json({ err: 'Plan id not provided' });
    }

    const { title } = req.body;

    // Finding the plan and updating
    const plan = await _Plan2.default.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const { id, duration, price } = await plan.update(req.body);
    await plan.save();

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const { plan_id } = req.params;

    // Validating param
    if (!plan_id) {
      return res.status(400).json({ err: 'Plan id not provided' });
    }

    // Finding the plan
    const plan = await _Plan2.default.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Deleting the plan
    await plan.destroy();

    return res.json({ msg: `${plan.title} was successfully deleted` });
  }

  async index(req, res) {
    const { page = 1, title, duration, price } = req.query;

    const query = {};

    // Conditionally building the query object
    if (title) query.title = title;
    if (duration) query.duration = duration;
    if (price) query.price = price;

    const plans = await _Plan2.default.findAll({
      where: { ...query },
      offset: (page - 1) * 10,
      limit: 10,
      attributes: ['title', 'duration', 'price'],
    });

    return res.json(plans);
  }
}

exports. default = new PlansController();
