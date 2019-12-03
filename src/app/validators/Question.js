import Joi from 'joi';
import validate from '../util/validate';

class QuestionValidator {
  async store(req, res, next) {
    const schema = Joi.object().keys({
      question: Joi.string().required(),
    });

    // Validating the input data
    await validate(res, next, req.body, schema);
  }
}

export default new QuestionValidator();
