const Filter = require('../Filter');

module.exports = class GreaterThanFilter extends Filter {

  test(value) {
    return value > this.value;
  }

};
