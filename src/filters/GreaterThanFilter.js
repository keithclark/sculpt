import Filter from '../objects/Filter.js';

export default class GreaterThanFilter extends Filter {

  test(value) {
    return value > this.value;
  }

};
