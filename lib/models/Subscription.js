const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  endpoint: String,
  keys: mongoose.Schema.Types.Mixed,
  createDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  pushHour: Number,
});

module.exports = mongoose.model('Subscription', schema);
