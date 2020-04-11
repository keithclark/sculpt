import Filter from '../objects/Filter.js';

export default class LessThanOrEqualToFilter extends Filter {

  test(value) {
    return value <= this.value;
  }

};
