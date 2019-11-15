import Joi from 'joi';
import { format } from 'date-fns';
import { Op } from 'sequelize';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import HelpOrderEmail from '../jobs/HelpOrderMail';

import validationSchema from '../../validationSchemas/helpOrder';

class HelpOrderController {
  async store(req, res) {
    Joi.validate(req.body, validationSchema.storeAnswer, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    const { question_id } = req.params;

    // Validating question id
    if (!question_id) {
      return res.status(400).json({ err: 'Question id not provided' });
    }

    // Verifying if the question exists
    const existingQuestion = await HelpOrder.findByPk(question_id);

    if (!existingQuestion) {
      return res.status(404).json({ err: 'Question not found' });
    }

    const { answer } = req.body;

    // Updating the question with the answer and date
    await existingQuestion.update({ answer, answer_at: Date.now() });
    await existingQuestion.save();

    const { email, name } = await Student.findByPk(existingQuestion.student_id);

    const { question, answer_at } = existingQuestion;

    // Sending email to the student with the question and his answer
    await Queue.add(HelpOrderEmail.key, {
      email,
      name,
      question,
      answer,
      answer_at: format(answer_at, "'At day' dd 'of' MMMM',' H:mm 'hours'"),
    });

    return res.json(existingQuestion);
  }

  // Listing all the questions that aren't answered yet
  async index(req, res) {
    const pendingQuestions = await HelpOrder.findAll({
      where: { answer: { [Op.eq]: null } },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'weight', 'height'],
        },
      ],
    });

    return res.json({ pendingQuestions });
  }
}

export default new HelpOrderController();
