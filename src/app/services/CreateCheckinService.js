import { differenceInCalendarDays, format, getDay } from 'date-fns';
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

    const existingCheckins = await Checkin.findAll({ where: { student_id } });

    // Verifying if the user made more than 1 checkin per day
    existingCheckins.forEach(checkin => {
      if (getDay(checkin.createdAt) === getDay(Date.now())) {
        throw new Error(
          JSON.stringify({
            err: `You have already done an checkin at ${format(
              checkin.createdAt,
              "dd/mm/yyyy '-' pp"
            )}`,
            contentMessage: `Você já fez um checkin hoje - ${format(
              checkin.createdAt,
              "dd/mm/yyyy '-' pp"
            )}`,
          })
        );
      }
    });

    // Verifying the last days and counting until now to calculate the limit of days (7)
    const limit =
      existingCheckins &&
      existingCheckins.forEach(async checkin => {
        if (differenceInCalendarDays(Date.now(), checkin.createdAt) > 7) {
          // Deleting old checkins
          return Checkin.destroy({ where: { student_id } });
        }
      });

    // If exists more than 5, the students areb't allowed to do more checkins
    if (existingCheckins.length >= 5) {
      throw new Error('Limit of checkins was reached');
    }

    const checkin = await Checkin.create({ student_id });

    return checkin;
  }
}

export default new CreateCheckinService();
