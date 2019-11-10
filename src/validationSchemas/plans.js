import Joi from 'joi';

export default {
  store: Joi.object().keys({
    title: Joi.string().required(),
    price: Joi.number().required(),
    duration: Joi.number()
      .integer()
      .required(),
  }),

  update: Joi.object().keys({
    title: Joi.string(),
    price: Joi.number(),
    duration: Joi.number().integer(),
  }),
};
