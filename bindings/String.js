const Binding = require('../Binding');

/**
 * @typedef {Object} StringBindingOptions
 * @property {Boolean} required - is this property required
 * @property {Boolean} allowEmpty - can this property be an empty string
 */

/**
 * @constructor
 * @param {StringBindingOptions} options
 */
module.exports = class StringBinding extends Binding {

  validate(value) {

    let error = super.validate(value);

    if (error) {
      return error;
    }

    if (typeof value !== 'string' && typeof value !== 'undefined') {
      return 'invalid type';
    }

    if (this.options.allowEmpty && value === '') {
      return 'required';
    }

  }
};
