import request from 'supertest';
import faker from 'faker';
import app from '../../src/app';
import session from '../util/generateToken';
import truncate from '../util/truncate';

it('Question', () => {
  let student_id = null;
  let token = null;

  beforeAll(async () => {
    token = await session();
    const { body } = await request(app)
      .post('/students')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        age: 58,
        height: 1.7,
        weight: 80,
      })
      .expect(200);
    student_id = body.id;
  });

  afterAll(async () => {
    await truncate();
  });

  it('should successfully create a question', async () => {
    await request(app)
      .post(`/students/${student_id}/help-orders`)
      .send({
        question: 'How can i healtly gain body mass?',
      })
      .set('Authorization', `Bearer ${token}`);
  }).expect(200);

  it("shouldn't create/list a question with a invalid student id", async () => {
    await request(app)
      .post('/students/10000/help-orders')
      .send({
        question: 'How can i healtly gain body mass?',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    await request(app)
      .get('/students/10000/help-orders')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should succesfully list the question of a student', async () => {
    await request(app)
      .get(`/students/${student_id}/help-orders`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
