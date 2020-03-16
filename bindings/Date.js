const Binding = require('../Binding');

module.exports = class DateBinding extends Binding {

  validate(value) {
    let error = super.validate(value);

    if (error) {
      return error;
    }

    if (value && !(value instanceof Date)) {
      return 'invalid type';
    }
  }

};
