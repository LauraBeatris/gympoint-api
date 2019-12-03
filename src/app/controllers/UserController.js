import User from '../models/User';
import Cache from '../../lib/Cache';

class UserController {
  async store(req, res) {
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
    // Finding the user register
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const { oldPassword } = req.body;

    if (req.body.email !== undefined && req.body.email !== user.email) {
      const { email } = req.body;
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

    const updatedUser = await user.update(req.body);
    await user.save();

    // Invalidating cache
    await Cache.invalidate(`user:${req.userId}`);

    return res.json(updatedUser);
  }

  // Showing the user data -> After authentication
  async show(req, res) {
    const cacheKey = `user:${req.userId}`;
    const cached = await Cache.get(cacheKey);

    // If cached, return it
    if (cached) {
      return res.json(cached);
    }

    const { userId } = req;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const { id, name, email } = user;

    // Catching the data for the user profile
    await Cache.set(cacheKey, { id, name, email });

    return res.json({ id, name, email });
  }
}

export default new UserController();
