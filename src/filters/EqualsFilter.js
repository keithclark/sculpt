import Filter from '../objects/Filter.js';

export default class EqualsFilter extends Filter {

  test(value) {
    return value == this.value;
  }

};
