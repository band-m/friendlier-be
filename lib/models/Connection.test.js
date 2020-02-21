const Connection = require('./Connection');

describe('connection model', () => {
  let connection;
  beforeEach(() => connection = new Connection({}));

  it('should require contactId', () => {
    const { errors } = connection.validateSync();
    expect(errors.contactId.message).toEqual('Path `contactId` is required.');
  });

  it('should require a type', () => {
    const { errors } = connection.validateSync();
    expect(errors.type.message).toEqual('Path `type` is required.');
  });

  it('should require a timeStamp', () => {
    const { errors } = connection.validateSync();
    expect(errors.timeStamp.message).toEqual('Path `timeStamp` is required.');
  });
});
