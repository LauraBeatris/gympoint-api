import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factory';

describe('Input', () => {
  beforeEach(async () => {
    // Deleting all of the old the registers before run each test
    await truncate();
  });

  it('should validate input data - user and session', async () => {
    // Generating the user data

    // Creating the user passing invalid data
    const { status: userStatus } = await request(app)
      .post('/users')
      .send({ name: 5555, password: 123 });

    // Creating an session passing invalid data
    const { status: sessionStatus } = await request(app)
      .post('/sessions')
      .send({ name: 5555, password: 123 });

    expect(userStatus).toBe(400);
    expect(sessionStatus).toBe(400);
  });

  it('should validate plan input data - update & store', async () => {
    // Generating the user data
    const user = await factory.attrs('User');

    // Creating the user
    await request(app)
      .post('/users')
      .send(user);

    const { email, password } = user;

    // Creating an session
    const { body: sessionBody } = await request(app)
      .post('/sessions')
      .send({ email, password });

    const { token } = sessionBody;

    // Creating the plan
    const { status: storeInput } = await request(app)
      .post('/plans')
      .send({ title: 555, duration: 'wrong', price: 'cheap' })
      .set('Authorization', `Bearer ${token}`);

    // Creating the plan
    const { status: updateInput } = await request(app)
      .put('/plans/1')
      .send({ title: 555, duration: 'wrong', price: 'cheap' })
      .set('Authorization', `Bearer ${token}`);

    expect(storeInput).toBe(400);
    expect(updateInput).toBe(400);
  });
});
