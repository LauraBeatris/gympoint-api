import Joi from 'joi';
import * as Yup from 'yup';
import validate from '../util/validate';

class UserValidator {
  async store(req, res, next) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6),
    });

    // Validating the input data
    await validate(req, next, req.body, schema);
  }

  async update(req, res, next) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string()
          .min(6)
          .when('oldPassword', (oldPassword, field) =>
            oldPassword ? field.required() : field
          ),
        confirmPassword: Yup.string()
          .min(6)
          .when('password', (password, field) =>
            password ? field.required() : field
          ),
      });

      await schema.validate(req.body, { abortEarly: true });

      return next();
    } catch (err) {
      return res.status(400).json({ error: 'Validation fails', details: err });
    }
  }
}

export default new UserValidator();
