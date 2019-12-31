import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CreateCheckinService {
  async run({ student_id }) {
    // Validating student id
    if (!student_id) {
      throw new Error('Student id not provided');
    }

    // Verifying if the student exists
    const existingStudent = await Student.findByPk(student_id);

    if (!existingStudent) {
      throw new Error('Student not found');
    }

    // The limit range for 5 checkins
    const today = new Date();
    const limitDay = subDays(today, 6);

    const existingCheckins = await Checkin.findAll({
      where: {
        student_id,
        createdAt: {
          [Op.between]: [limitDay, today],
        },
      },
    });

    if (existingCheckins.length >= 5)
      throw new Error(
        JSON.stringify({
          err: 'This student has already done 5 checkins in the last 7 days',
          contentMessage: 'Voce já realizou 5 checkins nos ultimos 7 dias',
        })
      );

    const { id, createdAt } = await Checkin.create({ student_id });

    return { id, student_id, createdAt };
  }
}

export default new CreateCheckinService();
