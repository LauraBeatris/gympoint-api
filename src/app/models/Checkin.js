import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {
        checkin_message: Sequelize.VIRTUAL,
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

export default Checkin;
