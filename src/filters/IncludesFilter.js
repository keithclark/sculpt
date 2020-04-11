import Filter from '../objects/Filter.js';

export default class IncludesFilter extends Filter {

  test(value) {
    return this.value.includes(value);
  }

};
