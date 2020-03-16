const Binding = require('../Binding');


module.exports = class BooleanBinding extends Binding {

  validate(value) {

    let error = super.validate(value);

    if (error) {
      return error;
    }

    if (typeof value !== 'boolean' && typeof value !== 'undefined') {
      return 'invalid type';
    }

  }
};
