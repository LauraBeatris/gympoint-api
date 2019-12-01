import Joi from 'joi';

const validate = async (res, data, schema) => {
  await Joi.validate(data, schema, err => {
    if (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', details: err.details });
    }
    return true;
  });
};

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
    await validate(res, req.body, schema);
  }

  async update(req, res, next) {
    const schema = Joi.object().keys({
      title: Joi.string(),
      price: Joi.number(),
      duration: Joi.number().integer(),
    });

    // Validating the input data
    await validate(res, req.body, schema);
  }
}

export default new PlanValidator();
