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
  commFrequency: {
    type: Number,
    required: true
  },
  createdOn: Date,
  lastContactedDate: Date,
  notificationRange: Number,
  slider1: Number,
  slider2: Number,
  yellowZoneStartDate: Date,
  redZoneStartDate: Date,
  deadlineDate: Date,
  deadlineNumber: Number,
  deadlineUnit: String,
  deadlineObject: Object,
  connHistory: Array,
  birthdate: Date,
  specialDates: Array,
  notes: String
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.id;
    }
  }
});

schema.virtual('connections', {
  localField: '_id',
  foreignField: 'contactId',
  ref: 'Contact'
});

module.exports = mongoose.model('Contact', schema);
