"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

// TO DO -> Put the validate schema in the validators folder

class UserController {
  async store(req, res) {
    const schema = _joi2.default.object().shape({
      name: _joi2.default.string().required(),
      email: _joi2.default.string()
        .email()
        .required(),
      password: _joi2.default.string()
        .required()
        .min(6),
    });

    // Validating the input data
    _joi2.default.validate(req.body, schema, err => {
      if (err) {
        return res.status(400).json({ err: err.details });
      }
    });

    // Verifying if there's another user register with the same email
    const userExists = await _User2.default.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Destructuring just the necessary data to return
    const { name, email } = await _User2.default.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    return res.json({ name, email });
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
    const user = await _User2.default.findByPk(req.userId);

    const { oldPassword, email } = req.body;

    if (email !== user.email) {
      // Verifying if there isn't a user already using this same email.
      const userExists = await _User2.default.findOne({
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
}

exports. default = new UserController();
