import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Validating the input data
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email: passedEmail } = req.body;

    // Verifying if there's another user register with the same email
    const userExists = await User.findOne({ where: { email: passedEmail } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Destructuring just the necessary data to return
    const { name, email } = await User.create(req.body);

    return res.json({ name, email });
  }

  async update(req, res) {}
}

export default new UserController();
