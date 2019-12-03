import Joi from 'joi';
import validate from '../util/validate';

class PlanValidator {
  async store(req, res, next) {
    const schema = Joi.object().keys({
      title: Joi.string().required(),
      price: Joi.number().required(),
      duration: Joi.number()
        .integer()
        .required(),
    });

    // Validating the input data
    await validate(res, next, req.body, schema);
  }

  async update(req, res, next) {
    const schema = Joi.object().keys({
      title: Joi.string(),
      price: Joi.number(),
      duration: Joi.number().integer(),
    });

    // Validating the input data
    await validate(res, next, req.body, schema);
  }
}

export default new PlanValidator();
