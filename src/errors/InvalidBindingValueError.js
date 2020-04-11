import SculptError from '../objects/SculptError.js';

export default class InvalidBindingValueError extends SculptError {
  constructor(name, value, reason) {
    super(`Invalid value '${value}' for property '${name}' - ${reason}.`)
    this.property = name;
    this.value = value;
    this.reason = reason
  }
};
