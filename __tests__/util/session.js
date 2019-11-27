import request from 'supertest';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import app from '../../src/app';
import truncate from '../util/truncate'

// Generating the user data
 const user = {
   name: faker.name.firstName(),
   email: faker.internet.email(),
   password: faker.internet.password(),
 };


export default async () => {
  // Truncating db to not create duplitated users 
  await truncate()

  // Creating the user
  const { body: userBody } = await request(app)
    .post('/users')
    .send(user)
    .expect(200);

  const { id } = userBody;

  // Returning the token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
