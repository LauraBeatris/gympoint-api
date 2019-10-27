import * as Yup from 'yup';
import Student from '../models/Student';

class StudentControler {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.integer().required(),
      weight: Yup.integer().required(),
      height: Yup.float().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const studentExists = await Student.findOne({ where: { email } });

    if (studentExists) {
      return res
        .status(400)
        .json({ error: 'A Student with that email already exists' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {}
}

export default new StudentControler();
