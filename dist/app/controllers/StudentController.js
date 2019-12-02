"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _Student = require('../models/Student'); var _Student2 = _interopRequireDefault(_Student);

class StudentControler {
  async store(req, res) {
    const schema = _joi2.default.object().keys({
      name: _joi2.default.string().required(),
      email: _joi2.default.string()
        .email()
        .required(),
      age: _joi2.default.number()
        .integer()
        .required(),
      weight: _joi2.default.number().required(),
      height: _joi2.default.number().required(),
    });

    // Validating the input data
    _joi2.default.validate(req.body, schema, err => {
      if (err) {
        return res.status(400).json({ err: err.details });
      }
    });

    const { email } = req.body;

    // Verifying if there's another student register with the same email
    const studentExists = await _Student2.default.findOne({ where: { email } });
    if (studentExists) {
      return res
        .status(400)
        .json({ error: 'A student with that email already exists' });
    }

    const { id, name, height, weight } = await _Student2.default.create(req.body);

    return res.json({ id, name, email, height, weight });
  }

  async update(req, res) {
    // For updating a student, it needs to provide his/her id as a route param

    const schema = _joi2.default.object().keys({
      name: _joi2.default.string(),
      email: _joi2.default.string().email(),
      age: _joi2.default.number().integer(),
      weight: _joi2.default.number(),
      height: _joi2.default.number(),
    });

    // Validating the input data
    _joi2.default.validate(req.body, schema, err => {
      if (err) {
        return res.status(400).json({ err: err.details });
      }
    });

    const { email } = req.body;

    // Finding the student register
    const student = await _Student2.default.findByPk(req.params.student_id);

    if (email && email !== student.email) {
      // Verifying if there isn't a student already using this same email.
      const studentExists = await _Student2.default.findOne({
        where: { email },
      });

      if (studentExists) {
        return res
          .status(400)
          .json({ error: 'A student with that email already exists' });
      }
    }

    const { id, name, height, weight } = await student.update(req.body);

    return res.json({ id, name, email, height, weight });
  }

  async index(req, res) {
    const students = await _Student2.default.findAll();

    return res.json(students);
  }

  async show(req, res) {
    const { student_id } = req.params;

    if (!student_id)
      return res.status(400).json({ err: 'Student id not provided' });

    const student = await _Student2.default.findByPk(student_id);

    return res.json(student);
  }

  async delete(req, res) {
    const { student_id } = req.params;

    if (!student_id)
      return res.status(400).json({ err: 'Student id not provided' });

    const student = await _Student2.default.findByPk(student_id);
    await student.destroy();

    return res.json({
      msg: `Student - ${student.name}<${student.email}> deleted successfully`,
    });
  }
}

exports. default = new StudentControler();
