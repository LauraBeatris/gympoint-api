import Joi from 'joi';
import Student from '../models/Student';

class StudentControler {
  async store(req, res) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      age: Joi.number()
        .integer()
        .required(),
      weight: Joi.number().required(),
      height: Joi.number().required(),
    });

    // Validating the input data
    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(400).json({ err: err.details });
      }
    });

    const { email } = req.body;

    // Verifying if there's another student register with the same email
    const studentExists = await Student.findOne({ where: { email } });
    if (studentExists) {
      return res
        .status(400)
        .json({ error: 'A student with that email already exists' });
    }

    const { id, name, height, weight } = await Student.create(req.body);

    return res.json({ id, name, email, height, weight });
  }

  async update(req, res) {
    // For updating a student, it needs to provide his/her id as a route param
    const schema = Joi.object().keys({
      name: Joi.string(),
      email: Joi.string().email(),
      age: Joi.number().integer(),
      weight: Joi.number(),
      height: Joi.number(),
    });

    const { student_id } = req.params;
    if (!student_id || !student_id.match(/^-{0,1}\d+$/))
      return res.status(400).json({ err: 'Student id not provided' });

    // Validating the input data
    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(400).json({ err: err.details });
      }
    });

    const { email } = req.body;

    // Finding the student register
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ err: 'Student not found' });
    }

    if (email && email !== student.email) {
      // Verifying if there isn't a student already using this same email.
      const studentExists = await Student.findOne({
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
    const students = await Student.findAll();

    return res.json(students);
  }

  async show(req, res) {
    const { student_id } = req.params;
    if (!student_id || !student_id.match(/^-{0,1}\d+$/))
      return res.status(400).json({ err: 'Student id not provided' });

    const student = await Student.findByPk(student_id);

    return res.json(student);
  }

  async delete(req, res) {
    const { student_id } = req.params;
    if (!student_id || !student_id.match(/^-{0,1}\d+$/))
      return res.status(400).json({ err: 'Student id not provided' });

    const student = await Student.findByPk(student_id);
    await student.destroy();

    return res.json({
      msg: `Student - ${student.name}<${student.email}> deleted successfully`,
    });
  }
}

export default new StudentControler();
