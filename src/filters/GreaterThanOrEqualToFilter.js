import Filter from '../objects/Filter.js';

export default class GreaterThanOrEqualToFilter extends Filter {

  test(value) {
    return value >= this.value;
  }

};
