const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  phoneNumber: String,
  address: String,
  email: String,
  image: String,
  commFreq: {
    type: String,
    required: true
  },
  connHistory: Array,
  birthdate: Date,
  specialDates: Array,
  notes: String
});

// schema.virtual('connections', {
//   localField: '_id',
//   foreignField: 'contactId',
//   ref: 'Contact'
// });

module.exports = mongoose.model('Contact', schema);
