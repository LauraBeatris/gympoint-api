import jwt from 'jsonwebtoken';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    // Verifying if the user exists
    const user = await User.findOne({ where: { email } });
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

    // Returning user profile informations and the token with the id as the payload
    return res.json({
      user: {
        name,
        email,
      },
      token: jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
      }),
    });
  }
}

export default new SessionController();
