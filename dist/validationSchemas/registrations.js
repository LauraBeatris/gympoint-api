"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);

exports. default = {
  store: _joi2.default.object().keys({
    start_date: _joi2.default.date().required(),
    student_id: _joi2.default.number()
      .integer()
      .required(),
    plan_id: _joi2.default.number()
      .integer()
      .required(),
  }),

  update: _joi2.default.object().keys({
    start_date: _joi2.default.date(),
    end_date: _joi2.default.date(),
    price: _joi2.default.number(),
    student_id: _joi2.default.number().integer(),
    plan_id: _joi2.default.number().integer(),
  }),
};
