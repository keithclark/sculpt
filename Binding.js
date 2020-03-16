/**
 * @typedef {Object} BindingOptions
 * @property {Boolean} required - is this property required
 */

module.exports = class Binding {

  /**
   * @constructor
   * @param {BindingOptions} options
   */
  constructor(options = {}) {
    this.options = options;
  }

  validate(value) {
    if (this.options.required && value === undefined) {
      return 'required';
    }
  }

};
