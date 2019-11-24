import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';
import factory from '../factory';
import truncate from '../util/truncate';

describe('User', () => {
  afterAll(async () => {
    await truncate();
  });
  beforeEach(async () => {
    await truncate();
  });

  it('should create the user successfully', async () => {
    // Generating the user data
    const user = await factory.attrs('User');

    const { body } = await request(app)
      .post('/users')
      .send(user);

    expect(body).toHaveProperty('id');
  });

  it("shouldn't create two user with the same email", async () => {
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

  it('should encrypt password after create the user', async () => {
    // Creating the user with factory but overriding the generated password
    const user = await factory.create('User', {
      password: '123456',
    });

    // Comparing the passed password with the hash - It will return a boolean value
    const compareHash = await bcrypt.compare(user.password, user.password_hash);

    expect(compareHash).toBeTruthy();
  });

  it("shouldn't re-encrypt password after updating the user without passing the password data", async () => {
    // Creating the user passing the current password
    const user = await factory.create('User', {
      password: '123456',
    });

    // Destructuring the user data to get the current password hash
    const { password_hash: current_hash } = user;

    // Updating the user with other informations, without password
    const { password_hash: updated_hash } = await user.update({
      name: 'Luiz',
      email: 'luiz@gmail.com',
    });

    // Expecting that the current hash not changed
    expect(current_hash).not.toBe(updated_hash);
  });
});
