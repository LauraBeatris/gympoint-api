import Joi from 'joi';
import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';

import validationSchema from '../../validationSchemas/helpOrder';

class HelpOrderController {
  async store(req, res) {
    Joi.validate(req.body, validationSchema.answer, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    const { question_id } = req.params;

    // Validating question id
    if (!question_id) {
      return res.status(400).json({ err: 'Student id not provided' });
    }

    // Verifying if the question exists
    const existingQuestion = await HelpOrder.findByPk(question_id);

    if (!existingQuestion) {
      return res.status(404).json({ err: 'Question not found' });
    }

    const { answer } = req.body;

    // Updating the question with the answer and date
    await existingQuestion.update({ answer, answer_at: Date.now() });
  }

  // Listing all the questions that aren't answered yet
  async index(req, res) {
    const pendingQuestions = await HelpOrder.findAll({
      where: { answer: { [Op.not]: [null, ''] } },
    });

    return res.json({ pendingQuestions });
  }
}

export default new HelpOrderController();
