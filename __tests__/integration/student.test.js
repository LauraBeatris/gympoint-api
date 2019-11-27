import request from 'supertest';

import app from '../../src/app';
import factory from '../factory';
import truncate from '../util/truncate';
import session from '../util/session';

describe('Student', () => {
  let token = null;
  let studentData = null;

  //Creating a new session 
  beforeAll(async () => {
    token = await session();
  });

  beforeEach(async () => {
    await truncate('Student')
    studentData = await factory.attrs('Student');
  });

  it('should succesfully create a student', async () => {
    // Creating the student passing the auth header
    const { body: student } = await request(app)
      .post('/students')
      .send(studentData)
      .set('Authorization', `Bearer ${token}`);

    expect(student).toHaveProperty('id');
  });

  it('should succesfully update a student', async () => {
    // Creating the student passing the auth header
    const studentResponse = await request(app)
      .post('/students')
      .send(studentData)
      .set('Authorization', `Bearer ${token}`);

    const { body, status } = studentResponse;

    expect(status).toBe(200);

    // Updating the student passing the auth header
    const { body: studentUpdated } = await request(app)
      .put(`/students/${body.id}`)
      .send({ ...studentData, name: 'New name' })
      .set('Authorization', `Bearer ${token}`);

    expect(studentUpdated.name).toBe('New name');
  });

  it("shouldn't create two students with the same email", async () => {
    // Creating first student
    await request(app)
      .post('/students')
      .send(studentData)
      .set('Authorization', `Bearer ${token}`);

    // Creating the second student with the same email
    await request(app)
      .post('/students')
      .send(studentData)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it("shouldn't update a student with an email that already exists", async () => {
    // Creating the first user
    await request(app)
      .post('/students')
      .send(studentData)
      .set('Authorization', `Bearer ${token}`);

    // Creating the second student
    const { body: willBeUpdated } = await request(app)
      .post('/students')
      .send({ ...studentData, email: 'test@gmail.com' })
      .set('Authorization', `Bearer ${token}`);
    const { id } = willBeUpdated;

    // Updating the second student data with an email that already exists
    const { status } = await request(app)
      .put(`/students/${id}`)
      .send(studentData)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(400);
  });

  it('should provide the student id', async () => {
    // Not passing the student id to the route
    const { status: showStatus } = await request(app)
      .get(`/students/test`)
      .set('Authorization', `Bearer ${token}`);

    // Not passing the student id to the route
    const { status: updateStatus } = await request(app)
      .put(`/students/test`)
      .send(studentData)
      .set('Authorization', `Bearer ${token}`);

    const { status: deleteStatus } = await request(app)
      .delete(`/students/test`)
      .set('Authorization', `Bearer ${token}`);

    expect(showStatus).toBe(400);
    expect(updateStatus).toBe(400);
    expect(deleteStatus).toBe(400);
  });

  it('should delete student successfully', async () => {
    // Creating student
    const { body } = await request(app)
      .post('/students')
      .send(studentData)
      .set('Authorization', `Bearer ${token}`);

    const { id } = body;

    // Deleting the student
    const { status } = await request(app)
      .delete(`/students/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
  });

  it('should show and list students successfully', async () => {
    // Creating student
    const { body } = await request(app)
      .post('/students')
      .send(studentData)
      .set('Authorization', `Bearer ${token}`);

    const { id } = body;

    // Showing and listing students
    const { status: showStatus } = await request(app)
      .get(`/students/${id}`)
      .set('Authorization', `Bearer ${token}`);
    const { status: indexStatus } = await request(app)
      .get(`/students`)
      .set('Authorization', `Bearer ${token}`);

    expect(showStatus).toBe(200);
    expect(indexStatus).toBe(200);
  });
});
