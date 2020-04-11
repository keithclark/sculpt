import Filter from '../objects/Filter.js';

export default class LessThanFilter extends Filter {

  test(value) {
    return value < this.value;
  }

};
