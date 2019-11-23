import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factory';
import User from '../../src/app/models/User';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  test('should create the user successfully', async () => {
    // Generating the user data
    const user = await factory.attrs('User');

    const { body } = await request(app)
      .post('/users')
      .send(user);

    expect(body).toHaveProperty('id');
  });

  test('should encrypt password after create the user', () => {});

  test("shouldn't create an user with an email that already exists", () => {});
});
