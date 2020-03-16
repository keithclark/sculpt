const Filter = require('../Filter');

module.exports = class GreaterThanOrEqualToFilter extends Filter {

  test(value) {
    return value >= this.value;
  }

};
