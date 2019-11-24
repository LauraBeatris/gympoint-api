import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';

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

  it('should validate student input data when updated', async () => {});
});
