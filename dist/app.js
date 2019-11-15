"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _path = require('path');
var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);

require('./database');

_dotenv2.default.config({
  path: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env',
});

class App {
  constructor() {
    this.server = _express2.default.call(void 0, );
    this.isDev = process.env.NODE_ENV !== 'production';

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Ready to receive request bodies in JSON format
    this.server.use(_express2.default.json());
  }

  routes() {
    this.server.use(_routes2.default);
  }
}

exports. default = new App().server;
