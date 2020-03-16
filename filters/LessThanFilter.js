const Filter = require('../Filter');

module.exports = class LessThanFilter extends Filter {

  test(value) {
    return value < this.value;
  }

};
