import request from 'supertest';
import faker from 'faker';
import app from '../../src/app';
import session from '../util/generateToken';
import truncate from '../util/truncate';

describe('Answer', () => {
  let student_id = null;
  let token = null;
  let question_id = null;

  beforeAll(async () => {
    token = await session();
    const { body: studentBody } = await request(app)
      .post('/students')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        age: 58,
        height: 1.7,
        weight: 80,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    student_id = studentBody.id;

    const { body: questionBody } = await request(app)
      .post(`/students/${student_id}/help-orders`)
      .send({
        question: 'How can i healtly gain body mass?',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    question_id = questionBody.helpOrder.id;
  });

  afterAll(async () => {
    await truncate();
  });

  it('should successfully answer a student', async () => {
    await request(app)
      .post(`/help-orders/${question_id}/answer`)
      .send({ answer: "Well... you can't eat junk food" })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it("shouldn't create an answer with a invalid question id", async () => {
    await request(app)
      .post(`/help-orders/10000/answer`)
      .send({ answer: "Well... you can't eat junk food" })
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('should successfully list the pending questions', async () => {
    await request(app)
      .get('/help-orders/pending')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
