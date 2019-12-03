import Joi from 'joi';

export default async function validate(res, next, data, schema) {
  await Joi.validate(data, schema, err => {
    if (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', details: err.details });
    }
    return next();
  });
}
