import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';
import session from '../util/session';

describe('Input', () => {
  let token = null;

  // Creating session
  beforeAll(async () => {
    token = await session();
  });

  it('should validate input data - user and session', async () => {
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
