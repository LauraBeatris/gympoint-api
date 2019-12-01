import Joi from 'joi';

class QuestionValidator {
  async store(req, res, next) {
    const schema = Joi.object().keys({
      question: Joi.string().required(),
    });

    // Validating the input data
    await Joi.validate(req.body, schema, err => {
      if (err) {
        return res
          .status(400)
          .json({ error: 'Validation fails', details: err.details });
      }

      return next();
    });
  }
}

export default new QuestionValidator();
