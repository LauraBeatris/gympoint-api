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

    // Creating the user
    await request(app)
      .post('/users')
      .send(user);

    const { email, password } = user;

    // Creating an session
    const { body: sessionBody } = await request(app)
      .post('/sessions')
      .send({ email, password });

    /*
       Showing the plans - needs to be authenticated - pass the token as a auth header
       Accessing the auth middleware, decrypting the user id with the token and then getting the plans list
       in the next request
    */
    const { status } = await request(app)
      .get('/plans')
      .set('Authorization', `Bearer ${sessionBody.token}`);

    // If the user data was returned that means that the user id was passed to the next req
    expect(status).toBe(200);
  });

  it("if not authenticated, the user shoudn't access the next middleware", async () => {
    // Generating the user data
    const user = await factory.attrs('User');

    const { email, password } = user;

    // Creating an session
    const { body: sessionBody } = await request(app)
      .post('/sessions')
      .send({ email, password });

    /*
      Passing an invalid token - The auth middleware shouldn't allow to proceed
    */
    const { status } = await request(app)
      .get('/plans')
      .set('Authorization', `Bearer ${sessionBody.token}`);

    // If the user data was returned that means that the user id was passed to the next req
    expect(status).toBe(401);
  });
});
