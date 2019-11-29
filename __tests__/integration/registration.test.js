import request from 'supertest';
import faker from 'faker';
import { parseISO, formatISO } from 'date-fns';
import app from '../../src/app';
import session from '../util/session';
import truncate from '../util/truncate';

describe('Registration', () => {
  let token = null;
  let plan_id = null;
  let student_id = null;
  let registration_id = null;
  const start_date = parseISO(formatISO(new Date()));

  // Creating a new session, student, plan
  beforeAll(async () => {
    token = await session();

    const { body: planData } = await request(app)
      .post('/plans')
      .send({
        title: faker.name.title(),
        duration: Math.floor(Math.random() * 11),
        price: faker.commerce.price(),
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { body: studentData } = await request(app)
      .post('/students')
      .send({
        name: 'Laura',
        email: 'laura@gmail.com',
        age: 58,
        height: 1.7,
        weight: 80,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    plan_id = planData.id;
    student_id = studentData.id;
  });

  afterAll(async () => {
    await truncate('Registration');
  });

  it('should succesfully create a registration', async () => {
    const { body: registrationData } = await request(app)
      .post('/registrations')
      .send({ start_date, plan_id, student_id })
      .set('Authorization', `Bearer ${token}`);

    const { id } = registrationData;
    registration_id = id;

    expect(registrationData).toHaveProperty('start_date');
  });

  it("shouldn't create a registration with an invalid plan/student", async () => {
    const { status } = await request(app)
      .post('/registrations')
      .send({ start_date, plan_id: 1000, student_id: 1000 })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
  });

  it("shouldn't create two registration for the same student", async () => {
    const { status } = await request(app)
      .post('/registrations')
      .send({ start_date, plan_id, student_id })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(401);
  });

  it('should successfully update a registration', async () => {
    const { body } = await request(app)
      .put(`/registrations/${registration_id}`)
      .send({ start_date: '2019-11-10T22:07:16+03:00' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.start_date).toBe('2019-11-10T19:07:16.000Z');
  });

  it("shouldn't update/delete a registration with an invalid id", async () => {
    const { status: updateStatus } = await request(app)
      .put('/registrations/1000')
      .send({ start_date: '2019-11-10T22:07:16+03:00' })
      .set('Authorization', `Bearer ${token}`);

    const { status: deleteStatus } = await request(app)
      .delete('/registrations/1000')
      .set('Authorization', `Bearer ${token}`);

    expect(updateStatus).toBe(404);
    expect(deleteStatus).toBe(404);
  });

  it('should successfully delete a registration', async () => {
    await request(app)
      .delete(`/registrations/${registration_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
