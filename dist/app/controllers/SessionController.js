"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class SessionController {
  async store(req, res) {
    const schema = _joi2.default.object().keys({
      email: _joi2.default.string().required(),
      password: _joi2.default.string().required(),
    });

    // Validating the input data
    _joi2.default.validate(req.body, schema, err => {
      if (err) {
        return res.status(400).json({ err: err.details });
      }
    });

    const { email, password } = req.body;

    // Verifying if the user exists
    const user = await _User2.default.findOne({ where: { email } });
    if (!user) {
      // Then, not allowed to proceed
      return res.status(401).json({ error: 'User not found. Unauthorized' });
    }

    // Password verification
    if (!(await user.checkPassword(password))) {
      // Then, not allowed to proceed
      return res
        .status(401)
        .json({ error: "Password doesn't match. Unauthorized" });
    }

    const { id, name } = user;

    // Returning user informations and the token with the id as the payload
    return res.json({
      id,
      name,
      email,
      token: _jsonwebtoken2.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
      }),
    });
  }
}

exports. default = new SessionController();
