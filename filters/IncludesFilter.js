const Filter = require('../Filter');

module.exports = class IncludesFilter extends Filter {

  test(value) {
    return this.value.includes(value);
  }

};
