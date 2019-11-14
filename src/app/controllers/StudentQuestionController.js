import Joi from 'joi';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import validationSchema from '../../validationSchemas/helpOrder';

class QuestionController {
  async store(req, res) {
    Joi.validate(req.body, validationSchema.question, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

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

    const { question } = req.body;

    const helpOrder = await HelpOrder.create({
      question,
    });

    return res.json({ helpOrder });
  }

  async index(req, res) {
    const { student_id } = req.body;

    // Validating student id
    if (!student_id) {
      return res.status(400).json({ err: 'Student id not provided' });
    }

    // Verifying if the student exists
    const existingStudent = await Student.findByPk(student_id);

    if (!existingStudent) {
      return res.status(404).json({ err: 'Student not found' });
    }

    // Listing all the help orders made by the student
    const helpOrders = await HelpOrder.findAll({
      where: { student_id },
      include: {
        model: Student,
        as: 'student',
      },
    });

    return res.json({ helpOrders });
  }
}

export default new QuestionController();
