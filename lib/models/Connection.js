const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Connection', schema);
