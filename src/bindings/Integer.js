import Binding from '../objects/Binding.js';

export default class IntegerBinding extends Binding {

  constructor(options) {
    super(options)
  }

  validate(value) {
    let error = super.validate(value);

    if (error) {
      return error;
    }

    if (typeof value !== 'undefined' && typeof value !== 'number') {
      return 'invalid type';
    }

    /*
    if (value < this.options.min || value > this.options.max) {
      return 'out of range';
    }
    */
  }

};
