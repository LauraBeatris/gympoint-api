import request from 'supertest';

import truncate from '../util/truncate';
import app from '../../src/app';
import factory from '../factory';

describe('Plan', () => {
  beforeEach(async () => {
    // Deleting all of the old the registers before run each test
    await truncate();
  });

  it('should create a plan succesfully', async () => {
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

    // Generating the plan data
    const plan = await factory.attrs('Plan');

    // Creating the plan
    const { status } = await request(app)
      .post('/plans')
      .send(plan)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
  });

  it("shoudn't create two plans with the same name", async () => {
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
    // Generating the plan data
    const plan = await factory.attrs('Plan');

    // Creating the first plan
    await request(app)
      .post('/plans')
      .send(plan)
      .set('Authorization', `Bearer ${token}`);

    // Creating the second plan with the same name
    const { status } = await request(app)
      .post('/plans')
      .send(plan)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(400);
  });

  it("shouldn't update/delete a plan with an invalid plan id", async () => {
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
    // Generating the plan data
    const plan = await factory.attrs('Plan');

    // Updating plans with invalid ids
    const { status: putNotFoundStatus } = await request(app)
      .put('/plans/100000')
      .send(plan)
      .set('Authorization', `Bearer ${token}`);
    const { status: putInvalidStatus } = await request(app)
      .put('/plans/abc')
      .send(plan)
      .set('Authorization', `Bearer ${token}`);

    // Deleting plans with invalid ids
    const { status: deleteNotFoundStatus } = await request(app)
      .delete('/plans/100000')
      .set('Authorization', `Bearer ${token}`);
    const { status: deleteInvalidStatus } = await request(app)
      .delete('/plans/abc')
      .set('Authorization', `Bearer ${token}`);

    expect(putNotFoundStatus).toBe(404);
    expect(putInvalidStatus).toBe(400);
    expect(deleteNotFoundStatus).toBe(404);
    expect(deleteInvalidStatus).toBe(400);
  });

  it('should delete successfully the plan', async () => {
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
    // Generating the plan data
    const plan = await factory.attrs('Plan');

    // Deleting the plan with an invalid id
    const { body } = await request(app)
      .post('/plans')
      .send(plan)
      .set('Authorization', `Bearer ${token}`);

    // Deleting the plan with an invalid id
    const { status } = await request(app)
      .delete(`/plans/${body.id}`)
      .send(plan)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
  });

  it('should update a plan succesfully', async () => {
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

    const planData = await factory.attrs('Plan');

    // Creating the plan passing the auth header
    const { body: plan } = await request(app)
      .post('/plans')
      .send(planData)
      .set('Authorization', `Bearer ${sessionBody.token}`);

    // Updating the plan passing the auth header
    const { body: planUpdated } = await request(app)
      .put(`/plans/${plan.id}`)
      .send({ ...planData, title: 'New title' })
      .set('Authorization', `Bearer ${sessionBody.token}`);

    expect(planUpdated.title).toBe('New title');
  });

  it('should delete a plan succesfully', async () => {});

  it("shoudn't update a plan with an invalid plan id", async () => {
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

    const planData = await factory.attrs('Plan');

    // Updating the plan with an invalid plan id
    const { status: firstStatus } = await request(app)
      .put(`/plans/111111`)
      .send({ ...planData, title: 'New title' })
      .set('Authorization', `Bearer ${sessionBody.token}`);

    const { status: secondStatus } = await request(app)
      .put(`/plans/aaa`)
      .send({ ...planData, title: 'New title' })
      .set('Authorization', `Bearer ${sessionBody.token}`);

    expect(firstStatus).toBe(404);
    expect(secondStatus).toBe(400);
  });

  it("shoudn't update a with a name that is already used", async () => {
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

    const planData = await factory.attrs('Plan');

    // Creating the first plan
    await request(app)
      .post('/plans')
      .send(planData)
      .set('Authorization', `Bearer ${sessionBody.token}`);

    // Creating the second plan
    const { body: willBeUpdated } = await request(app)
      .post('/plans')
      .send({ ...planData, title: 'another title' })
      .set('Authorization', `Bearer ${sessionBody.token}`);

    const { id } = willBeUpdated;

    // Updating the second plan data with an title that already exists
    const { status } = await request(app)
      .put(`/plans/${id}`)
      .send(planData)
      .set('Authorization', `Bearer ${sessionBody.token}`);

    expect(status).toBe(400);
  });

  it('should list plans succesfully', async () => {
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

    // Updating the plan with an invalid plan id
    const { status } = await request(app)
      .get('/plans')
      .set('Authorization', `Bearer ${sessionBody.token}`);

    expect(status).toBe(200);
  });
});
