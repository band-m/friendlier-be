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
    user = User.create({
      displayName: 'Funkadelic',
      email: 'test@test.com',
      passwordHash: 'hvjhtvut5646yrvth'
    });
    contact = Contact.create({
      userId: (await user)._id,
      firstName: 'George',
      commFreq: '2 weeks'
    });
  });

  afterAll(() => mongoose.connection.close());

});
