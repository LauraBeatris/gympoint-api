import Joi from 'joi';
import validate from '../util/validate';

class StudentValidator {
  async store(req, res, next) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      age: Joi.number()
        .integer()
        .required(),
      weight: Joi.number().required(),
      height: Joi.number().required(),
    });

    // Validating the input data
    await validate(res, next, req.body, schema);
  }

  async update(req, res, next) {
    const schema = Joi.object().keys({
      name: Joi.string(),
      email: Joi.string().email(),
      age: Joi.number().integer(),
      weight: Joi.number(),
      height: Joi.number(),
    });

    // Validating the input data
    await validate(res, next, req.body, schema);
  }
}

export default new StudentValidator();
