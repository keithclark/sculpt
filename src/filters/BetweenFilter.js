import Filter from '../objects/Filter.js';

export default class BetweenFilter extends Filter {

  constructor(min, max) {
    // Can't use Math.min/Math.max here as it casts values to numbers
    if (min < max) {
      super([min, max]);
    } else {
      super([max, min]);
    }
  }

  test(value) {
    return value > this.min && value < this.max;
  }

};
