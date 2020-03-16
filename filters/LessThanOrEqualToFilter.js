const Filter = require('./Filter');

module.exports = class LessThanOrEqualToFilter extends Filter {

  test(value) {
    return value <= this.value;
  }

};
