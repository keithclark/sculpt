const { getObjectName } = require('./utils');
const SculptError = require('./SculptError');
const Provider = require('./Provider');


const assertModelHasProvider = model => {
  if (!model.provider) {
    throw new SculptError(`Model '${getObjectName(model.type)}' doesn't have a provider`);
  }
};


const assertValidProvider = provider => {
  assertTypeOf(provider, Provider, 'provider');
}


const assertTypeOf = (obj, type, prefix = 'value') => {
  if (!(obj instanceof type)) {
    throw new TypeError(`Invalid ${prefix} type: '${getObjectName(obj)}'.`);
  }
};


const assertIsObjectLiteral = (obj, prefix = 'value') => {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    throw new TypeError(`Invalid ${prefix} type: '${getObjectName(obj)}'.`);
  };
}

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
  assertIsObjectLiteral,
  assertTypeOf,
  assertTypeCanBeModelled,
  assertModelHasProvider,
  assertValidProvider
}