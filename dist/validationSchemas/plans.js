"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);

exports. default = {
  store: _joi2.default.object().keys({
    title: _joi2.default.string().required(),
    price: _joi2.default.number().required(),
    duration: _joi2.default.number()
      .integer()
      .required(),
  }),

  update: _joi2.default.object().keys({
    title: _joi2.default.string(),
    price: _joi2.default.number(),
    duration: _joi2.default.number().integer(),
  }),
};
