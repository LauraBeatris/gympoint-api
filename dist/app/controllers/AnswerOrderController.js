"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _datefns = require('date-fns');
var _sequelize = require('sequelize');

var _HelpOrder = require('../models/HelpOrder'); var _HelpOrder2 = _interopRequireDefault(_HelpOrder);
var _Student = require('../models/Student'); var _Student2 = _interopRequireDefault(_Student);
var _Queue = require('../../lib/Queue'); var _Queue2 = _interopRequireDefault(_Queue);
var _HelpOrderMail = require('../jobs/HelpOrderMail'); var _HelpOrderMail2 = _interopRequireDefault(_HelpOrderMail);

var _helpOrder = require('../../validationSchemas/helpOrder'); var _helpOrder2 = _interopRequireDefault(_helpOrder);

class HelpOrderController {
  async store(req, res) {
    _joi2.default.validate(req.body, _helpOrder2.default.storeAnswer, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    const { question_id } = req.params;

    // Validating question id
    if (!question_id) {
      return res.status(400).json({ err: 'Question id not provided' });
    }

    // Verifying if the question exists
    const existingQuestion = await _HelpOrder2.default.findByPk(question_id);

    if (!existingQuestion) {
      return res.status(404).json({ err: 'Question not found' });
    }

    const { answer } = req.body;

    // Updating the question with the answer and date
    await existingQuestion.update({ answer, answer_at: Date.now() });
    await existingQuestion.save();

    const { email, name } = await _Student2.default.findByPk(existingQuestion.student_id);

    const { question, answer_at } = existingQuestion;

    // Sending email to the student with the question and his answer
    await _Queue2.default.add(_HelpOrderMail2.default.key, {
      email,
      name,
      question,
      answer,
      answer_at: _datefns.format.call(void 0, answer_at, "'At day' dd 'of' MMMM',' H:mm 'hours'"),
    });

    return res.json(existingQuestion);
  }

  // Listing all the questions that aren't answered yet
  async index(req, res) {
    const pendingQuestions = await _HelpOrder2.default.findAll({
      where: { answer: { [_sequelize.Op.eq]: null } },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: [
        {
          model: _Student2.default,
          as: 'student',
          attributes: ['id', 'name', 'email', 'weight', 'height'],
        },
      ],
    });

    return res.json({ pendingQuestions });
  }
}

exports. default = new HelpOrderController();
