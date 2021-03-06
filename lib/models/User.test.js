const User = require('./User');

describe('user model', () => {
  let user;
  beforeEach(() => {
    user = new User({});
  });

  it('should require an email', () => {
    const { errors } = user.validateSync();
    expect(errors.email.message).toEqual('Path `email` is required.');
  });

  it('should require a passwordHash', () => {
    const { errors } = user.validateSync();
    expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.');
  });
});
