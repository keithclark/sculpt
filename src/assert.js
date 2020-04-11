import { getObjectName } from './utils.js';
import SculptError from './objects/SculptError.js';


export const assert = (value, message, errorType = SculptError) => {
  if (value !== true) {
    throw new errorType(message);
  }
}

export const assertModelHasProvider = model => {
  assert(!!model.provider, `Model '${getObjectName(model.type)}' doesn't have a provider`);
};

export const assertIsNull = (value, message = `'${value}' must be 'null`) => {
  assert(value === null, message);
}

export const assertMapKeyExists = (map, key, message = `Could not find key '${key}' in ${getObjectName(map)}`) => {
  assert(map.has(key), message);
};

export const assertTypeOf = (obj, type, prefix = 'value') => {
  assert(obj instanceof type, `Invalid ${prefix} type: '${getObjectName(obj)}'`, TypeError);
};

export const assertIsObjectLiteral = (obj, prefix = 'value') => {
  assert(
    Object.prototype.toString.call(obj) === '[object Object]',
    `Invalid ${prefix} type: '${getObjectName(obj)}'`,
    TypeError
  );
};

/**
 * Checks a type to see if it can be modelled. Throws a TypeError if it cannot.
 *
 * @private
 * @param {Object} type - The object
 */
export const assertTypeCanBeModelled = type => {
  assertTypeOf(type, Function, 'model');
};
