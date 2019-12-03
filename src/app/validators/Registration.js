import Joi from 'joi';
import validate from '../util/validate';

class RegistrationValidator {
  async store(req, res, next) {
    const schema = Joi.object().keys({
      start_date: Joi.date().required(),
      student_id: Joi.number()
        .integer()
        .required(),
      plan_id: Joi.number()
        .integer()
        .required(),
    });

    // Validating the input data
    await validate(res, next, req.body, schema);
  }

  async update(req, res, next) {
    const schema = Joi.object().keys({
      start_date: Joi.date(),
      end_date: Joi.date(),
      price: Joi.number(),
      student_id: Joi.number().integer(),
      plan_id: Joi.number().integer(),
    });

    // Validating the input data
    await validate(res, next, req.body, schema);
  }
}

export default new RegistrationValidator();
