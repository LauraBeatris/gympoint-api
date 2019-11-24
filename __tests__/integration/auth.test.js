import request from 'supertest';

import app from '../../src/app';
import factory from '../factory';
import truncate from '../util/truncate';

describe('Auth', () => {
  beforeEach(async () => {
    // Deleting all of the old the registers before run each test
    await truncate();
  });

  it('if authenticated, the auth middleware should pass the token to next request', async () => {
    // Generating the user data
    const user = await factory.attrs('User');

    // Posting the data  user
    await request(app)
      .post('/users')
      .send(user);

    const { email, password } = user;
    // Creating an session
    const { body } = await request(app)
      .post('/sessions')
      .send({ email, password });

    // // Showing the user data - needs to be authenticated - pass the token as a auth header
    // const userData = await request(app)
    //   .get(`/users/${id}`)
    //   .set('Authorization', `Bearer ${token}`);
    // console.log(userData.body);

    expect(body).toHaveProperty('id');
  });

  it("if not authenticated, the user shoudn't access the next middleware", async () => {});
});
