const EqualsFilter = require('./EqualsFilter');

module.exports = class NotEqualsFilter extends EqualsFilter {

  test(value) {
    return !super.test(value);
  }

};
