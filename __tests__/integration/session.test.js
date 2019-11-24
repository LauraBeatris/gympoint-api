import request from 'supertest';

import app from '../../src/app';
import factory from '../factory';
import truncate from '../util/truncate';

describe('Session', () => {
  beforeEach(async () => {
    // Deleting all of the old the registers before run each test
    await truncate();
  });

  test('should create an session successfully', async () => {
    // Generating the user data
    const user = await factory.attrs('User');

    // Creating the user
    await request(app)
      .post('/users')
      .send(user);

    const { email, password } = user;

    // Creating an session
    const { body } = await request(app)
      .post('/sessions')
      .send({ email, password });

    expect(body).toHaveProperty('token');
  });

  test("shouldn't create an session with an user that not exists", async () => {
    // Generating the user data but not creating
    const { email, password } = await factory.attrs('User');

    // Creating an session
    const { status } = await request(app)
      .post('/sessions')
      .send({ email, password });

    expect(status).toBe(401);
  });

  test("shoudn't create an session with an user that not match his current password data", async () => {
    // Creating the user
    const { email } = await factory.create('User');

    // Creating an session with an different password
    const res = await request(app)
      .post('/sessions')
      .send({ email, password: '123' });

    expect(res.status).toBe(401);
  });
});
