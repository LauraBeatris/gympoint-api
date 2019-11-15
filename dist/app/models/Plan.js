"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Plan extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        title: _sequelize2.default.STRING,
        duration: _sequelize2.default.INTEGER,
        price: _sequelize2.default.FLOAT,
      },
      {
        sequelize,
      }
    );
  }
}

exports. default = Plan;
