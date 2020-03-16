const EqualsFilter = require('./filters/EqualsFilter');
const NotEqualsFilter = require('./filters/NotEqualsFilter');
const IncludesFilter = require('./filters/IncludesFilter');
const ExcludesFilter = require('./filters/ExcludesFilter');
const LessThanFilter = require('./filters/LessThanFilter');
const LessThanOrEqualToFilter = require('./filters/LessThanFilter');
const GreaterThanFilter = require('./filters/GreaterThanFilter');
const GreaterThanOrEqualToFilter = require('./filters/GreaterThanFilter');
const BetweenFilter = require('./filters/BetweenFilter');
const NotBetweenFilter = require('./filters/NotBetweenFilter');


module.exports = {
  equals: (v) => new EqualsFilter(v),
  notEquals: (v) => new NotEqualsFilter(v),
  lessThan: (v) => new LessThanFilter(v),
  lessThanOrEqualTo: (v) => new LessThanOrEqualToFilter(v),
  greaterThan: (v) => new GreaterThanFilter(v),
  greaterThanOrEqualTo: (v) => new GreaterThanOrEqualToFilter(v),
  includes: (v) => new IncludesFilter(v),
  excludes: (v) => new ExcludesFilter(v),
  between: (v1, v2) => new BetweenFilter(v1, v2),
  notBetween: (v1, v2) => new NotBetweenFilter(v1, v2)
};
