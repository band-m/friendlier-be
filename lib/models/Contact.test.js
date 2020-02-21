const Contact = require('Contact');

describe('contact model', () => {
  let contact;
  beforeEach(() => {
    contact = new Contact({});
  });

  it('should require firstName', () => {
    const {
      errors
    } = contact.validateSync();
    expect(errors.firstName.message).toEqual('Path `firstName` is required.');
  });

  it('should require communication frequency', () => {
    const {
      errors
    } = contact.validateSync();
    expect(errors.commFreq.message).toEqual('Path `commFreq` is required.');
  });
});
