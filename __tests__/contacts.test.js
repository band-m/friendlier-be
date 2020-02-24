require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Contact = require('../lib/models/Contact');

describe('contact routes', () => {
  const agent = request.agent(app);

  beforeAll(() => connect());

  beforeEach(() => mongoose.connection.dropDatabase());

  let user;
  let contact;
  beforeEach(async() => {
    user = await User.create({
      displayName: 'Funkadelic',
      email: 'test@test.com',
      passwordHash: 'hvjhtvut5646yrvth'
    });
    contact = await Contact.create({
      userId: user._id,
      firstName: 'George',
      commFreq: 2
    });
  });

  afterAll(() => mongoose.connection.close());

  it('should create a contact', () => {
    return request(app)
      .post('/api/v1/contacts')
      .send({
        userId: user._id,
        firstName: 'Dingaling',
        commFreq: 3
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: expect.any(String),
          firstName: 'Dingaling',
          commFreq: 3,
          connHistory: [],
          specialDates: [],
          __v: 0
        });
      });
  });

  it('should get all contacts', async() => {
    await agent
      .post('/api/v1/auth/login')
      .send({
        displayName: 'Funkadelic',
        email: 'test@test.com',
        passwordHash: 'hvjhtvut5646yrvth'
      });

    await Contact.create({
      userId: user._id,
      firstName: 'Billy',
      commFreq: 3
    });

    await agent.get(`/api/v1/contacts/${user._id}`)
      .then(contacts => {
        expect(contacts.body).toEqual([{
          __v: 0,
          _id: expect.any(String),
          commFreq: 2,
          connHistory: [],
          firstName: 'George',
          specialDates: [],
          userId: expect.any(String)
        }, {
          __v: 0,
          _id: expect.any(String),
          commFreq: 3,
          connHistory: [],
          firstName: 'Billy',
          specialDates: [],
          userId: expect.any(String)
        }]);
      });

  });
});
