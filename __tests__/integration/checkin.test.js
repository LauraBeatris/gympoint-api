import request from 'supertest';
import faker from 'faker';
import app from '../../src/app';
import session from '../util/generateToken';
import truncate from '../util/truncate';

describe('Checkin', () => {
  let token = null;
  let student_id = null;

  beforeAll(async () => {
    token = await session();
  });

  beforeEach(async () => {
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
    student_id = studentData.id;
  });

  afterAll(async () => {
    await truncate();
  });

  it('should create checkin succesfully', async () => {
    await request(app)
      .post(`/students/${student_id}/checkins`)
      .expect(200);
  });

  it("shouldn't create a checkin without passing a valid student id", async () => {
    await request(app)
      .post(`/students/10000/checkins`)
      .expect(404);
  });

  it('should succesfully list the checkins of a student', async () => {
    await request(app)
      .get(`/students/${student_id}/checkins`)
      .expect(200);
  });

  it("shouldn't create more than 5 checkins per student", async () => {
    for (i = 0; i < 4; i++) {
      const { status } = await request(app).post(
        `students/${student_id}/checkins`
      );

      if (i === 4) {
        await request(app)
          .post(`students/${student_id}/checkins`)
          .expect(401);
      }
    }
  });
});
