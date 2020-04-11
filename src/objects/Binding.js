/**
 * @typedef {Object} BindingOptions
 * @property {Boolean} required - is this property required
 */

 /**
 * Bindings are used to describe the properties of a class to sculpt. They are
 * used for property validation and are passed to data providers so they can
 * execute commands against a datastore (SQL statements, for example).
 */
export default class Binding {

  /**
   * @constructor
   * @param {BindingOptions} options
   */
  constructor(options = {}) {
    this.options = options;
  }


  /**
   * Checks to see if a value is valid for this binding. Returns a string
   * containing the failure reason or, if the value is valid, returns
   * `undefined`.
   *
   * Classes that extend `Binding` must call `super.validate(value)` to ensure
   * the base validation tests are honoured.
   *
   * @param {*} value - The value to valiate
   * @returns {string|undefined} - An error string or `undefined`
   */
  validate(value) {
    if (this.options.required && value === undefined) {
      return 'required';
    }
  }

};
