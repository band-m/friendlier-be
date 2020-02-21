const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  address: String,
  phoneNumber: String,
  firstName: String,
  lastName: String
});

schema.virtual('contacts', {
  localField: '_id',
  foreignField: 'userId',
  ref: 'Contact'
});

module.exports = mongoose.model('User', schema);
