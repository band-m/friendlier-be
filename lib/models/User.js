const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  address: String,
  phoneNumber: String,
  firstName: String,
  lastName: String,
  //push stuff. not best naming, but it will be faster this way.
  subscription: mongoose.Schema.Types.Mixed,
  pushHour: {
    type: Number,
    default: 2
  },
  wantsPush: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.passwordHash;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.passwordHash;
    }
  }
});

schema.virtual('contacts', {
  localField: '_id',
  foreignField: 'userId',
  ref: 'Contact'
});

schema.methods.isValidPassword = async function(password) {
  const user = this;
  return await bcrypt.compare(password, user.passwordHash);
};

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 14);
});

module.exports = mongoose.model('User', schema);
