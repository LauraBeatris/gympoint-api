import * as Yup from 'yup';
import Student from '../models/Student';

class StudentControler {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    // Validating the input data
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().integer(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    // Validating the input data
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    // Finding the student register
    const student = await Student.findByPk(req.params.student_id);

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
}

export default new StudentControler();
