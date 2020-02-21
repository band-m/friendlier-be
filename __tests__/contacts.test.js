require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Contact = require('../lib/models/Contact');

describe('contact routes', () => {
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
      commFreq: '2 weeks'
    });
  });

  afterAll(() => mongoose.connection.close());

  it('should create a contact', () => {
    console.log(user);
    
    return request(app)
      .post('/api/v1/contacts')
      .send({
        userId: user._id,
        firstName: 'Dingaling',
        commFreq: '1 month'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: expect.any(String),
          firstName: 'Dingaling',
          commFreq: '1 month',
          connHistory: [],
          specialDates: [],
          __v: 0
        });
      });
  });
});
