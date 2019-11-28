import request from 'supertest';

import faker from 'faker';
import app from '../../src/app';
import factory from '../factory';
import truncate from '../util/truncate';

describe('Session', () => {
  beforeAll(async () => {
    truncate();
  });
  afterAll(async () => {
    await truncate();
  });

  test('should create an session successfully', async () => {
    // Creating the user
    await request(app)
      .post('/users')
      .send({
        name: 'Laura Beatris',
        password: '123456',
        email: 'laura@test.com',
      })
      .expect(200);

    // Creating an session
    const { body } = await request(app)
      .post('/sessions')
      .send({ email: 'laura@test.com', password: '123456' });

    expect(body).toHaveProperty('token');
  });

  test("shouldn't create an session with an user that not exists", async () => {
    // Generating the user data but not creating
    // Creating an session
    const { status } = await request(app)
      .post('/sessions')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

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
