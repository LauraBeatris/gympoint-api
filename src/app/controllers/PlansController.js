import Plan from '../models/Plan';
import Registration from '../models/Registration';

import Cache from '../../lib/Cache';

class PlansController {
  async store(req, res) {
    const { title, duration, price } = req.body;

    // Veryfing if there's an existing plan with the same name
    const existingPlan = await Plan.findOne({ where: { title } });

    if (existingPlan) {
      return res.status(400).json({
        err: "There's already a plan with that name",
        messageContent: 'Um plano com esse nome já existe. Tente novamente',
      });
    }

    const { id } = await Plan.create({ title, duration, price });

    // Invalidating cached plans with that prefix
    await Cache.invalidatePrefix(`plans:${req.userId}`);

    return res.json({ id, title, price, duration });
  }

  async update(req, res) {
    // Validating param
    const { plan_id } = req.params;

    if (!plan_id || !plan_id.match(/^-{0,1}\d+$/)) {
      return res.status(400).json({ err: 'Plan id not provided' });
    }

    const { title } = req.body;

    // Finding the plan and updating
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    if (title && title !== plan.title) {
      const planExist = await Plan.findOne({ where: { title } });
      if (planExist) {
        return res.status(400).json({
          err: "There's already a plan with that name",
          messageContent: 'Um plano com esse nome já existe. Tente novamente',
        });
      }
    }

    const { id, duration, price } = await plan.update(req.body);
    await plan.save();

    // Invalidating cached plans with that prefix
    await Cache.invalidatePrefix(`plans:${req.userId}`);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const { plan_id } = req.params;
    console.log('plan id', plan_id);

    // Validating param
    if (!plan_id || !plan_id.match(/^-{0,1}\d+$/)) {
      return res.status(400).json({ err: 'Plan id not provided' });
    }

    // Finding the plan
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Verifying if there's a registration with that plan
    const registrationExists = await Registration.findAll({
      where: { plan_id: plan.id },
    });
    if (registrationExists.length > 0) {
      return res.status(404).json({
        error:
          'A registration with that plan exists. Delete or edit the registration and then delete the plan.',
        messageContent:
          'Uma matrícula com esse plano esta cadastrada. Delete essa matrícula ou edite-a',
      });
    }

    // Deleting the plan
    await plan.destroy();

    // Invalidating cached plans with that prefix
    await Cache.invalidatePrefix(`plans:${req.userId}`);

    return res.json({ msg: `${plan.title} was successfully deleted` });
  }

  async show(req, res) {
    const { plan_id } = req.params;

    // Validating param
    if (!plan_id || !plan_id.match(/^-{0,1}\d+$/)) {
      return res.status(400).json({ err: 'Plan id not provided' });
    }

    // Finding the plan
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const { id, title, price, duration } = plan;

    return res.json({ id, title, price, duration });
  }

  async index(req, res) {
    const { page = 1, title, duration, price } = req.query;

    const query = {};

    // Conditionally building the query object
    if (title) query.title = title;
    if (duration) query.duration = duration;
    if (price) query.price = price;

    let cacheKey = `plans:${req.userId}:page:${page}`;
    if (Object.values(query).length > 0) {
      Object.keys(query).map((q, key) => (cacheKey += `:${q}:${query[q]}`));
    }
    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const plans = await Plan.findAll({
      where: { ...query },
      offset: (page - 1) * 10,
      limit: 10,
      attributes: ['id', 'title', 'duration', 'price'],
    });
    await Cache.set(cacheKey, plans);

    return res.json(plans);
  }
}

export default new PlansController();
