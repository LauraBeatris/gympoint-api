import request from 'supertest';

import app from '../../src/app';
import factory from '../factory';

async function createSection() {
  const user = await factory.attrs('User');

  const { email, password } = user;

  const { body } = await request(app)
    .post('/sessions')
    .send({ email, password });

  return body.token;
}

export default createSection;
