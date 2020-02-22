const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
}, {
  toJSON: {
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

schema.methods.isValidPassword = async(password) => {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 14);
});

module.exports = mongoose.model('User', schema);
