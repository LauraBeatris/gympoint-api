import Joi from 'joi';
import validate from '../util/validate';

class SessionValidator {
  async store(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    // Validating the input data
    await validate(res, next, req.body, schema);
  }
}

export default new SessionValidator();
