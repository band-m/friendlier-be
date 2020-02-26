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
  createdOn: String,
  lastContactedDate: String,
  notificationRange: Number,
  yellowZoneStartDate: String,
  redZoneStartDate: String,
  deadlineDate: String,
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
