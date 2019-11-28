import request from 'supertest';

import app from '../../src/app';
import factory from '../factory';
import faker from 'faker'
import truncate from '../util/truncate';

describe('Session', () => {
  let user = null
  beforeEach(async () => {
    await truncate();
  });

  beforeAll(async () => {
    user = await factory.attrs('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  })

  test('should create an session successfully', async () => {
    // Creating the user
    await request(app)
      .post('/users')
      .send(user)
      .expect(200);

    const { email, password } = user;

    // Creating an session
    const { body } = await request(app)
      .post('/sessions')
      .expect(200)
      .send({ email, password });

    expect(body).toHaveProperty('token');
  });

  test("shouldn't create an session with an user that not exists", async () => {
    // Generating the user data but not creating
    const { email, password } = user;

    // Creating an session
    const { status } = await request(app)
      .post('/sessions')
      .send({ email, password });

    expect(status).toBe(401);
  });

  test("shouldn't create an session with an user that not match his current password data", async () => {
    // Creating the user
    const { email } = await factory.create('User', { password: '123456' });

    // Creating an session with an different password
    const res = await request(app)
      .post('/sessions')
      .send({ email, password: '1234567' });

    expect(res.status).toBe(401);
  });
});
