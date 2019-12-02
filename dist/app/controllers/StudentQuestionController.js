"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);

var _HelpOrder = require('../models/HelpOrder'); var _HelpOrder2 = _interopRequireDefault(_HelpOrder);
var _Student = require('../models/Student'); var _Student2 = _interopRequireDefault(_Student);

var _helpOrder = require('../../validationSchemas/helpOrder'); var _helpOrder2 = _interopRequireDefault(_helpOrder);

class QuestionController {
  async store(req, res) {
    _joi2.default.validate(req.body, _helpOrder2.default.storeQuestion, err => {
      if (err) return res.status(400).json({ err: err.details });

      return true;
    });

    const { student_id } = req.params;

    // Validating student id
    if (!student_id) {
      return res.status(400).json({ err: 'Student id not provided' });
    }

    // Verifying if the student exists
    const existingStudent = await _Student2.default.findByPk(student_id);

    if (!existingStudent) {
      return res.status(404).json({ err: 'Student not found' });
    }

    const { question } = req.body;

    const helpOrder = await _HelpOrder2.default.create({
      question,
      student_id,
    });

    return res.json({ helpOrder });
  }

  async index(req, res) {
    const { student_id } = req.params;

    // Validating student id
    if (!student_id) {
      return res.status(400).json({ err: 'Student id not provided' });
    }

    // Verifying if the student exists
    const existingStudent = await _Student2.default.findByPk(student_id);

    if (!existingStudent) {
      return res.status(404).json({ err: 'Student not found' });
    }

    // Listing all the help orders made by the student
    const helpOrders = await _HelpOrder2.default.findAll({
      where: { student_id },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: {
        model: _Student2.default,
        as: 'student',
        attributes: ['id', 'name', 'email', 'weight', 'height'],
      },
    });

    return res.json({ helpOrders });
  }
}

exports. default = new QuestionController();
