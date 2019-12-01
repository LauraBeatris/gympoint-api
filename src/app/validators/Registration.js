import Joi from 'joi';

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
    await Joi.validate(req.body, schema, err => {
      if (err) {
        return res
          .status(400)
          .json({ error: 'Validation fails', details: err.details });
      }
    });

    return next();
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
    await Joi.validate(req.body, schema, err => {
      if (err) {
        return res
          .status(400)
          .json({ error: 'Validation fails', details: err.details });
      }
    });
    return next();
  }
}

export default new RegistrationValidator();
