const { getObjectName } = require('./utils');


const assertTypeOf = (obj, type, prefix = 'value') => {
  if (!(obj instanceof type)) {
    throw new TypeError(`Invalid ${prefix} type: '${getObjectName(obj)}'.`);
  }
};

/**
 * Checks a type to see if it can be modelled. Throws a TypeError if it cannot.
 *
 * @private
 * @param {Object} type - The object
 */
const assertTypeCanBeModelled = type => {
  assertTypeOf(type, Function, 'model');
};

module.exports = {
  assertTypeOf,
  assertTypeCanBeModelled
}