import Joi from 'joi';
import * as Yup from 'yup';
import User from '../models/User';

// TO DO -> Put the validate schema in the validators folder

class UserController {
  async store(req, res) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6),
    });

    // Validating the input data
    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(400).json({ err: err.details });
      }
    });

    // Verifying if there's another user register with the same email
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Destructuring just the necessary data to return
    const { id, name, email } = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),

      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required() : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Finding the user register
    const user = await User.findByPk(req.userId);

    const { oldPassword, email } = req.body;

    if (email !== user.email) {
      // Verifying if there isn't a user already using this same email.
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ error: 'A user with that email already exists' });
      }
    }

    // oldPassword verification
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password doesn't match" });
    }

    const { id, name, password } = await user.update(req.body);
    await user.save();

    return res.json({ id, name, email, password });
  }

  // Showing the user data -> After authentication
  async show(req, res) {
    const { userId } = req;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const { name, email } = user;

    return res.json({ name, email });
  }
}

export default new UserController();
