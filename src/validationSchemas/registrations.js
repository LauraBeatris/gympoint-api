import Joi from 'joi';

export default {
  store: Joi.object().keys({
    start_date: Joi.date().required(),
    student_id: Joi.number()
      .integer()
      .required(),
    plan_id: Joi.number()
      .integer()
      .required(),
  }),

  update: Joi.object().keys({
    start_date: Joi.date(),
    end_date: Joi.date(),
    price: Joi.number(),
    student_id: Joi.number().integer(),
    plan_id: Joi.number().integer(),
  }),
};
