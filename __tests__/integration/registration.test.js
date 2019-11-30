import request from 'supertest';
import faker from 'faker';
import { parseISO, formatISO } from 'date-fns';
import app from '../../src/app';
import session from '../util/generateToken';
import truncate from '../util/truncate';

describe('Registration', () => {
  let token = null;
  let plan_id = null;
  const start_date = parseISO(formatISO(new Date()));

  // Creating a new session, student, plan before the tests
  beforeAll(async () => {
    token = await session();

    const { body: planData } = await request(app)
      .post('/plans')
      .send({
        title: faker.name.title(),
        duration: Math.floor(Math.random() * 11),
        price: faker.commerce.price(),
      })
      .set('Authorization', `Bearer ${token}`);

    plan_id = planData.id;
  });

  afterAll(async () => {
    await truncate('Registration');
  });

  it("shouldn't create two registration for the same student", async () => {
    const { body: studentData } = await request(app)
      .post('/students')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        age: 58,
        height: 1.7,
        weight: 80,
      })
      .set('Authorization', `Bearer ${token}`);
    await request(app)
      .post('/registrations')
      .send({ start_date, plan_id, student_id: studentData.id })
      .set('Authorization', `Bearer ${token}`);
    const { status } = await request(app)
      .post('/registrations')
      .send({ start_date, plan_id, student_id: studentData.id })
      .set('Authorization', `Bearer ${token}`);
    expect(status).toBe(401);
  });

  it("shouldn't update/delete a registration with an invalid id", async () => {
    const { status: updateStatus } = await request(app)
      .put('/registrations/100000')
      .send({ start_date: '2019-11-10T22:07:16+03:00' })
      .set('Authorization', `Bearer ${token}`);

    const { status: deleteStatus } = await request(app)
      .delete('/registrations/100000')
      .set('Authorization', `Bearer ${token}`);

    expect(updateStatus).toBe(404);
    expect(deleteStatus).toBe(404);
  });

  it('should successfully list registrations', async () => {
    await request(app)
      .get('/registrations')
      .query({
        query: 1,
        start_date: '2019-11-10T22:07:16+03:00',
        end_date: '2019-11-10T22:07:16+03:00',
        price: 55.5,
        plan_id: 1,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should successfully update a registration', async () => {
    const { body: studentData } = await request(app)
      .post('/students')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        age: 58,
        height: 1.7,
        weight: 80,
      })
      .set('Authorization', `Bearer ${token}`);

    const { body: registrationData } = await request(app)
      .post('/registrations')
      .send({ start_date, plan_id, student_id: studentData.id })
      .set('Authorization', `Bearer ${token}`);

    const { body } = await request(app)
      .put(`/registrations/${registrationData.id}`)
      .send({ start_date: '2019-11-10T22:07:16+03:00' })
      .set('Authorization', `Bearer ${token}`);

    registration_id = registrationData.id;

    expect(body.start_date).toBe('2019-11-10T19:07:16.000Z');
  });

  it('should succesfully delete a registration', async () => {
    const { body: studentData } = await request(app)
      .post('/students')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        age: 58,
        height: 1.7,
        weight: 80,
      })
      .set('Authorization', `Bearer ${token}`);

    const { body: registrationData } = await request(app)
      .post('/registrations')
      .send({ start_date, plan_id, student_id: studentData.id })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { status: deletedRegistrationStatus } = await request(app)
      .delete(`/registrations/${registrationData.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(deletedRegistrationStatus).toBe(200);
  });

  it("shouldn't create a registration with an invalid plan/student", async () => {
    const { status } = await request(app)
      .post('/registrations')
      .send({ start_date, plan_id: 1000, student_id: 1000 })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
  });
});
