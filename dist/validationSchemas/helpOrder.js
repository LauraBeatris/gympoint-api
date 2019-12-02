"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);

exports. default = {
  storeQuestion: _joi2.default.object().keys({
    question: _joi2.default.string().required(),
  }),

  storeAnswer: _joi2.default.object().keys({
    answer: _joi2.default.string().required(),
  }),
};
