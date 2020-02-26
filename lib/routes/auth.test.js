require('dotenv').config();

const request = require('supertest');
const app = require('../app');
const connect = require('../utils/connect');
const mongoose = require('mongoose');
const User = require('../models/User');
const prepare = require('../test-helpers/prepare');

describe('auth routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  beforeEach(() => {
    return User.init();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('signup route signs up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', displayName: 'Trogdor', password: 'password' })
      .then(async(res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          displayName: 'Trogdor',
          __v: 0
        });
        const user = await User.findOne({ email: 'test@test.com' });
        expect(prepare(user)).toEqual(prepare(res.body));
      });
  });

  it('signup route errors on signing up an existing email', async() => {
    await User.create({ email: 'test@test.com', displayName: 'Trogdor', password: 'password' });

    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', displayName: 'Trogdor', password: 'password' })
      .then(async(res) => {
        expect(res.body).toEqual({
          status: 400,
          message: 'A user with that email address already exists.'
        });
      });
  });

  it('login route logs in an existing user', async() => {
    const user = await User.create({ email: 'test@test.com', displayName: 'Trogdor', password: 'password' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual(prepare(user));
      });
  });

  it('login route fails when email is not in db', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'bademail@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid email or password.',
          status: 401,
        });
      });
  });

  it('login route fails on wrong password', async() => {
    await User.create({ email: 'test@test.com', displayName: 'Trogdor', password: 'password' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'badpassword' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid email or password.',
          status: 401,
        });
      });
  });

  it('verifies a user is logged in', async() => {
    const user = await User.create({ email: 'test@test.com', displayName: 'Trogdor', password: 'password' });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com', 
        password: 'password'
      });

    return agent
      .get('/api/v1/auth/signed-in')
      .then((res) => {
        expect(res.body).toEqual(prepare(user));
      });
  });

  it('update route updates the logged-in user', async() => {
    const user = await User.create({ email: 'test@test.com', displayName: 'Trogdor', password: 'password' });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com', 
        password: 'password'
      });
    
    return agent
      .patch('/api/v1/auth/update')
      .send({ phoneNumber: '867-5309' })
      .then((res) => {
        expect(res.body).toEqual(prepare({ ...user.toObject(), phoneNumber: '867-5309' }));
      });
  });
});
