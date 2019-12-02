"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class HelpOrder extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        question: _sequelize2.default.STRING,
        answer: _sequelize2.default.STRING,
        answer_at: _sequelize2.default.DATE,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

exports. default = HelpOrder;
