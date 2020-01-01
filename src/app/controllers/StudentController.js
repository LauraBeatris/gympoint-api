import { Op } from 'sequelize';
import Student from '../models/Student';
import Registration from '../models/Registration';

class StudentControler {
  async store(req, res) {
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
    const { student_id } = req.params;
    if (!student_id || !student_id.match(/^-{0,1}\d+$/))
      return res.status(400).json({ err: 'Student id not provided' });

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
        return res.status(400).json({
          error: 'A student with that email already exists',
          messageContent: 'Um aluno com esse email já esta cadastrado.',
        });
      }
    }

    const { id, name, height, weight } = await student.update(req.body);

    return res.json({ id, name, email, height, weight });
  }

  async index(req, res) {
    const { q = '', page = 1 } = req.query;

    // Filtering the students if the query param of a name was passed
    const students = q
      ? await Student.findAll({
          where: {
            name: { [Op.like]: `%${q}%` },
          },
          attributes: ['id', 'name', 'email', 'age'],
          offset: (page - 1) * 10,
          limit: 10,
        })
      : await Student.findAll({
          attributes: ['id', 'name', 'email', 'age'],
          offset: (page - 1) * 10,
          limit: 10,
        });

    return res.json(students);
  }

  async show(req, res) {
    const { student_id } = req.params;

    if (!student_id || !student_id.match(/^-{0,1}\d+$/))
      return res.status(400).json({ err: 'Student id not provided' });

    const student = await Student.findOne({
      where: { id: student_id },
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
    });

    if (!student) {
      return res.status(404).json({ err: 'Student not found' });
    }

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
