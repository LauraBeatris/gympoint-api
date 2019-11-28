import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';
import factory from '../factory';
import generateToken from '../util/generateToken';
import truncate from '../util/truncate'

describe('User', () => {
  let user = null; 

  beforeAll(async () => {
    await truncate()
  })

  afterAll(async () => {
    await truncate()
  })

  beforeEach(async () => {
    user = await factory.attrs('User')
  });

  

  it('should create the user successfully', async () => {
    // Generating the user data
    const user = await factory.attrs('User');

    const { body } = await request(app)
      .post('/users')
      .send(user);

    expect(body).toHaveProperty('id');
  });

  it("shouldn't create two user with the same email", async () => {
    // Generating the users data (Same email)
    // Posting the data of first user
    await request(app)
      .post('/users')
      .send({ name: 'Random', password: '1234566', email: 'laura@gmail.com'});

    // Posting the data of the second user and getting the response
    await request(app)
    .post('/users')
    .send({ name: 'Random', password: '1234566', email: 'laura@gmail.com'})
    .expect(400)
  });

  it('should encrypt password after create the user', async () => {
    // Creating the user with factory but overriding the generated password
    const user = await factory.create('User', {
      password: '123456',
    });

    // Comparing the passed password with the hash - It will return a boolean value
    const compareHash = await bcrypt.compare(user.password, user.password_hash);

    expect(compareHash).toBeTruthy();
  });

  it("shouldn't re-encrypt password after updating the user without passing the password data", async () => {
    // Creating the user passing the current password
    const user = await factory.create('User', {
      password: '123456',
    });

    // Destructuring the user data to get the current password hash
    const { password_hash: current_hash } = user;

    // Updating the user with other informations, without password
    const { password_hash: updated_hash } = await user.update({
      name: 'Luiz',
      email: 'luiz@gmail.com',
    });

    // Expecting that the current hash not changed
    expect(current_hash).not.toBe(updated_hash);
  });

  it('should update the user successfully', async () => {
    const userData = await factory.attrs('User', {
      password: '123456',
      email: 'laura@hotmail.com'
    });

    const { body: user } = await request(app)
      .post('/users')
      .send(userData);

    const { id } = user 
    const token = await generateToken(id)

    const { body } = await request(app)
    .put('/users')
    .send({name: 'Laura'})
    .set('Authorization', `Bearer ${token}`);

    expect(body.name).toBe('Laura')
  })

  it("shouldn't update the user password if not passed the old one", async () => {
    const userData = await factory.attrs('User', {
      password: '123456',
    });

    const { body: user } = await request(app)
      .post('/users')
      .send(userData);

    const { id } = user 
    const token = await generateToken(id)

    const { status } = await request(app)
      .put('/users')
      .send({password: '1234567'})
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(400);
  })

  it("shouldn't update the user password if the old password not match the current one", async () => {
    const userData = await factory.attrs('User', {
      password: '123456', email: 'matchpassword@gmail.com'
    });

    const { body: user } = await request(app)
      .post('/users')
      .send(userData)
      .expect(200);

    const { id } = user 
    const token = await generateToken(id)

    const { status } = await request(app)
      .put('/users')
      .send({password: '1234567', oldPassword: '123456634', confirmPassword: '1234567'})
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(401);
  })

  it("shouldn't update the user with an email that already exists", async () => {
    // Generating the first user data
    const firstUser = await factory.attrs('User', {
      email: 'same@gmail.com',
    });

    // Generating the second user data
    const secondUser = await factory.attrs('User', {
        email: 'test@gmail.com',
    });

    // Creating the first user
    await request(app)
      .post('/users')
      .send(firstUser)
      .expect(200)

    // Creating the second user
    const { body: user } = await request(app)
    .post('/users')
    .send(secondUser)
    .expect(200);

    // Getting the authorization token
    const { id } = user 
    const token = await generateToken(id)

    const { status } = await request(app).put('/users').send({email: 'same@gmail.com'}).set('Authorization', `Bearer ${token}`)
  
    expect(status).toBe(400);
  })

  it('should not update if user not found', async () => {
    // Generating a random token
    const token = await generateToken(1000)

    const { status } = await request(app)
    .put('/users')
    .send({email: 'test@gmail.com'})
    .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
  })

  it("should sucessfully show the user data", async () => {
    const userData =  await factory.attrs('User', { email: 'successfully@gmail.com'});

    const { body: user } = await request(app)
    .post('/users')
    .send(userData);

    const { id } = user 
    const token = await generateToken(id)

    const { body } = await request(app).get('/user').set('Authorization', `Bearer ${token}`)
    expect(body).toHaveProperty('name')
  })

  it("should't show the user data if the id passed is invalid", async () => {
    const token = await generateToken(1000)

    const { status } = await request(app).get('/user').set('Authorization', `Bearer ${token}`)
    expect(status).toBe(404)
  })
});
