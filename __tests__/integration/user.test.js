import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factory';

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

  test('should encrypt password after create the user', async () => {
    // Creating the user with factory but overriding the generated password
    const user = await factory.create('User', {
      password: '123456',
    });

    // Comparing the passed password with the hash - It will return a boolean value
    const compareHash = await bcrypt.compare(user.password, user.password_hash);

    expect(compareHash).toBeTruthy();
  });

  test("shouldn't create two user with the same email", async () => {
    // Generating the users data (Same email)
    const user = await factory.attrs('User');

    // Posting the data of first user
    await request(app)
      .post('/users')
      .send(user);

    // Posting the data of the second user and getting the response
    const { status } = await request(app)
      .post('/users')
      .send(user);

    expect(status).toBe(400);
  });
});
