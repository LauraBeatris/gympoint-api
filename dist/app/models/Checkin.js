"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Checkin extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        checkin_message: _sequelize2.default.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      const numberOfCheckins = await this.findAll({
        where: { student_id: user.student_id },
      });

      user.checkin_message = `You have done ${numberOfCheckins.length}/5 checkins until now`;
    });
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

exports. default = Checkin;
