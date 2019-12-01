import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';
import session from '../util/session';

describe('Auth', () => {
  let token = null;

  // Creating session
  beforeEach(async () => {
    token = await session();
  });

  it('if authenticated, the auth middleware should pass the token to next request', async () => {
    /*
       Showing the plans - needs to be authenticated - pass the token as a auth header
       Accessing the auth middleware, decrypting the user id with the token and then getting the plans list
       in the next request
    */
    await request(app)
      .get('/plans')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it("if not authenticated, the user id shouldn't access the next middleware", async () => {
    /*
      Accessing the route without passing an auth header - The auth middleware shouldn't allow to proceed
    */
    await request(app)
      .get('/plans')
      .expect(401);
  });
});
