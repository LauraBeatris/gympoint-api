import request from 'supertest';
import faker from 'faker';
import app from '../../src/app';
import factory from '../factory';
import session from '../util/session';
import truncate from '../util/truncate';

describe('Plan', () => {
  let token = null;
  let plan = null;

  // Creating a new session
  beforeAll(async () => {
    token = await session();
  });

  afterAll(async () => {
    await truncate('Plan');
  });

  // Genereting plan data
  beforeEach(async () => {
    plan = {
      title: faker.name.title(),
      duration: Math.floor(Math.random() * 11),
      price: faker.commerce.price(),
    };
  });

  it('should create a plan succesfully', async () => {
    // Creating the plan
    const { status } = await request(app)
      .post('/plans')
      .send(plan)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
  });

  it("shoudn't create two plans with the same name", async () => {
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
    // Creating a plan
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
    // Creating the plan passing the auth header
    const { body: createdPlan } = await request(app)
      .post('/plans')
      .send(plan)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { id } = createdPlan;
    const newTitle = faker.name.title();

    // Updating the plan passing the auth header
    const { body: planUpdated } = await request(app)
      .put(`/plans/${id}`)
      .send({ ...plan, title: newTitle })
      .set('Authorization', `Bearer ${token}`);

    expect(planUpdated.title).toBe(newTitle);
  });

  it('should delete a plan succesfully', async () => {});

  it("shouldn't update a plan with an invalid plan id", async () => {
    const planData = await factory.attrs('Plan');

    // Updating the plan with an invalid plan id
    const { status: firstStatus } = await request(app)
      .put(`/plans/111111`)
      .send({ ...planData, title: 'New title' })
      .set('Authorization', `Bearer ${token}`);

    const { status: secondStatus } = await request(app)
      .put(`/plans/aaa`)
      .send({ ...planData, title: 'New title' })
      .set('Authorization', `Bearer ${token}`);

    expect(firstStatus).toBe(404);
    expect(secondStatus).toBe(400);
  });

  it("shoudn't update a with a name that is already used", async () => {
    const planData = await factory.attrs('Plan');

    // Creating the first plan
    await request(app)
      .post('/plans')
      .send(planData)
      .set('Authorization', `Bearer ${token}`);

    // Creating the second plan
    const { body: willBeUpdated } = await request(app)
      .post('/plans')
      .send({ ...planData, title: 'another title' })
      .set('Authorization', `Bearer ${token}`);

    const { id } = willBeUpdated;

    // Updating the second plan data with an title that already exists
    const { status } = await request(app)
      .put(`/plans/${id}`)
      .send(planData)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(400);
  });

  it('should list plans succesfully', async () => {
    // Listing plans
    const { status } = await request(app)
      .get('/plans')
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
  });

  it('should list plans filtered by query params', async () => {
    await request(app)
      .get('/plans')
      .query({ page: 1, title: 'Random' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app)
      .get('/plans')
      .query({ page: 1, duration: 6 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app)
      .get('/plans')
      .query({ page: 1, price: 0 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
