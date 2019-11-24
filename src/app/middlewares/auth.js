import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const [, token] = authHeader.split(' ');
  console.log('token', token);
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const { id } = decoded;

    // Passing the id to next route
    req.userId = id;
    console.log('authenticated');
    return next();
  } catch (err) {
    return res.status(404).json({ error: 'Invalid token' });
  }
};
