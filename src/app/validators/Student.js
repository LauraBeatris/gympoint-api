import Joi from 'joi';

const validate = async (res, next, data, schema) => {
  await Joi.validate(data, schema, err => {
    if (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', details: err.details });
    }

    return next();
  });
};

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
