const IncludesFilter = require('./IncludesFilter');

module.exports = class ExcludesFilter extends IncludesFilter {

  test(value) {
    return !super.test(value);
  }

};
