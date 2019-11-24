import request from 'supertest';

import app from '../../src/app';

// Generating the user data
const user = {
  name: 'laura',
  email: 'test@user.com',
  password: '123456',
};

export default async () => {
  // Creating the user
  await request(app)
    .post('/users')
    .send(user);

  const { email, password } = user;

  // Creating an session
  const { body } = await request(app)
    .post('/sessions')
    .send({ email, password });

  return body.token;
};
