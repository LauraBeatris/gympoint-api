import request from 'supertest';
import faker from 'faker';
import { parseISO, formatISO } from 'date-fns';
import app from '../../src/app';
import factory from '../factory';
import session from '../util/session';
import truncate from '../util/truncate';

describe('Registration', () => {
  let token = null;
  let plan_id = null;
  let student_id = null;
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

    expect(registrationData).toHaveProperty('start_date');
  });

  it("shouldn't create a registration with an invalid plan/student", async () => {
    const { status } = await request(app)
      .post('/registrations')
      .send({ start_date, plan_id: 1000, student_id: 1000 })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
  });

  it.skip('should successfully update a registration', async () => {});

  it.skip("shouldn't update/delete a registration with an invalid id", async () => {});

  it.skip('should successfully delete a registration', async () => {});

  it.skip('should successfully list registrations', async () => {});
});
