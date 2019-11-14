import { differenceInCalendarDays, format, getDay, parseISO } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  // Storing the checkin - Possible just 5 time at a week
  async store(req, res) {
    const { student_id } = req.params;

    // Validating student id
    if (!student_id) {
      return res.status(400).json({ err: 'Student id not provided' });
    }

    // Verifying if the student exists
    const existingStudent = await Student.findByPk(student_id);

    if (!existingStudent) {
      return res.status(404).json({ err: 'Student not found' });
    }

    const existingCheckins = await Checkin.findAll({ where: { student_id } });

    // TO DO - Understand better the logic between the limit of checkins in a week

    // Counting the days between the last checking and the current day
    const daysBetween =
      existingCheckins[0] && existingCheckins[0].createdAt
        ? differenceInCalendarDays(
            Date.now(),
            existingCheckins[existingCheckins.length].createdAt
          )
        : null;

    // Verifying if the user made more than 1 checkin per day
    existingCheckins.forEach(checkin => {
      if (getDay(checkin.createdAt) === getDay(Date.now())) {
        return res.status(401).json({
          err: `You have already done an checkin at ${format(
            checkin.createdAt,
            'dd/mm/yyyy'
          )}`,
        });
      }
    });

    // If exists more than 5, the students isn't allowed to do more checkins
    if (existingCheckins.length >= 5) {
      return res.status(401).json({ err: 'Limit of checkins was reached' });
    }

    // After 7 days between the the last checkin and the current one, the checkins go back to count 0
    if (daysBetween > 7) {
      await Checkin.destroy({ where: { student_id } });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }

  // Listing the checkin of an specific user
  async index(req, res) {
    const { student_id } = req.params;

    // Validating student id
    if (!student_id) {
      return res.status(400).json({ err: 'Student id not provided' });
    }

    // Verifying if the student exists
    const existingStudent = await Student.findByPk(student_id);

    if (!existingStudent) {
      return res.status(404).json({ err: 'Student not found' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id },
      attributes: ['id', 'created_at', 'updated_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'weight', 'height'],
        },
      ],
    });

    return res.json({ checkins });
  }
}

export default new CheckinController();
