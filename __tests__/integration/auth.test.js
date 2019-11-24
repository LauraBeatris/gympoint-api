import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';
import session from '../util/session';

describe('Auth', () => {
  let token = null;

  // Creating session
  beforeAll(async () => {
    token = await session();
  });

  afterAll(async () => {
    await truncate();
  });

  it('if authenticated, the auth middleware should pass the token to next request', async () => {
    /*
       Showing the plans - needs to be authenticated - pass the token as a auth header
       Accessing the auth middleware, decrypting the user id with the token and then getting the plans list
       in the next request
    */
    const { status } = await request(app)
      .get('/plans')
      .set('Authorization', `Bearer ${token}`);

    // If the plans data was returned that means that the user id was passed to the next req
    expect(status).toBe(200);
  });

  it("if not authenticated, the user shoudn't access the next middleware", async () => {
    /*
      Passing an invalid token - The auth middleware shouldn't allow to proceed
    */
    const { status: invalidTokenStatus } = await request(app)
      .get('/plans')
      .set('Authorization', `Bearer 123`);

    /*
      Accessing the route without passing an auth header - The auth middleware shouldn't allow to proceed
    */
    const { status: noHeaderStatus } = await request(app).get('/plans');

    expect(invalidTokenStatus).toBe(401);
    expect(noHeaderStatus).toBe(401);
  });
});
