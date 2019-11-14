import Joi from 'joi';

export default {
  storeQuestion: Joi.object().keys({
    question: Joi.string().required(),
  }),

  storeAnswer: Joi.object().keys({
    answer: Joi.string().required(),
  }),
};
