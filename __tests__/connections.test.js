require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Contact = require('../lib/models/Contact');
const Connection = require('../lib/models/Connection');

describe('contact routes', () => {
  const agent = request.agent(app);

  beforeAll(() => connect());

  beforeEach(() => mongoose.connection.dropDatabase());

  let user;
  let contact;
  let connection;
  beforeEach(async() => {
    user = await User.create({
      displayName: 'Funkadelic',
      email: 'test@test.com',
      password: 'hvjhtvut5646yrvth'
    });

    contact = await Contact.create({
      userId: user._id,
      firstName: 'George',
      commFreq: 2
    });

    connection = await Connection.create({
      contactId: contact._id,
      type: 'call',
      timestamp: 'October 1, 1999'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        displayName: 'Funkadelic',
        email: 'test@test.com',
        password: 'hvjhtvut5646yrvth'
      });
  });

  afterAll(() => mongoose.connection.close());

  it('should create a new connection', () => {
    return request(app)
      .post('/api/v1/connections')
      .send({
        contactId: contact._id,
        type: 'text',
        timestamp: 'June 17, 1986'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          contactId: expect.any(String),
          type: 'text',
          timestamp: '1986-06-17T07:00:00.000Z',
          __v: 0
        });
      });
  });

  it('should get all connections associated with a contact', async() => {
    await Connection.create({
      contactId: contact._id,
      type: 'text',
      timestamp: 'June 17, 1986'
    });

    return agent
      .get(`/api/v1/connections/${contact._id}`)
      .then(connections => {
        expect(connections.body).toEqual([{
          __v: 0,
          _id: expect.any(String),
          contactId: expect.any(String),
          timestamp: '1999-10-01T07:00:00.000Z',
          type: 'call'
        }, {
          __v: 0,
          _id: expect.any(String),
          contactId: expect.any(String),
          timestamp: '1986-06-17T07:00:00.000Z',
          type: 'text'
        }]);
      });
  });

  it('should update a connection by id', async() => {
    return agent
      .patch(`/api/v1/connections/${connection._id}`)
      .send({ type: 'email' })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          contactId: expect.any(String),
          timestamp: '1999-10-01T07:00:00.000Z',
          type: 'email'
        });
      });
  });
});
