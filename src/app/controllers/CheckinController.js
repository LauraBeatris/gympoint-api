import CreateCheckinService from '../services/CreateCheckinService';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  // Storing the checkin - Possible just 5 time at a week
  async store(req, res) {
    const { student_id } = req.params;

    // Running the service responsable for creating the checkin
    const checkin = await CreateCheckinService.run({ student_id });

    return res.json(checkin);
  }

  // Listing the checkin of an specific user
  async index(req, res) {
    const { student_id } = req.params;
    const { page = 1 } = req.query;

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
      attributes: ['id', 'created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'weight', 'height'],
        },
      ],
      offset: (page - 1) * 7,
      limit: 7,
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
