const BetweenFilter = require('./BetweenFilter');

module.exports = class NotBetweenFilter extends BetweenFilter {

  test(value) {
    return !super.test(value);
  }

};
