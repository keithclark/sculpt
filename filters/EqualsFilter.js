const Filter = require('../Filter');

module.exports = class EqualsFilter extends Filter {

  test(value) {
    return value == this.value;
  }

};
