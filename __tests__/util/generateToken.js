import jwt from 'jsonwebtoken';

export default (id) => {
 // Returning the token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}