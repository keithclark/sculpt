/**
 * @module filters
 */

import EqualsFilter from './filters/EqualsFilter.js';
import NotEqualsFilter from './filters/NotEqualsFilter.js';
import IncludesFilter from './filters/IncludesFilter.js';
import ExcludesFilter from './filters/ExcludesFilter.js';
import LessThanFilter from './filters/LessThanFilter.js';
import LessThanOrEqualToFilter from './filters/LessThanOrEqualToFilter.js';
import GreaterThanFilter from './filters/GreaterThanFilter.js';
import GreaterThanOrEqualToFilter from './filters/GreaterThanOrEqualToFilter.js';
import BetweenFilter from './filters/BetweenFilter.js';
import NotBetweenFilter from './filters/NotBetweenFilter.js';

/**
 * Creates a new filter for testing equality
 *
 * @param {*} value - the value to filter
 * @returns {EqualsFilter} filter instance
 *
 * @example
 * let user = await User.find({id: equals(1)})
 */
export const equals = (v) => new EqualsFilter(v);


/**
 * Creates a new filter for testing non-equality
 *
 * @param {*} value - the value to filter
 * @returns {NotEqualsFilter} filter instance
 * @example
 * let user = await User.find({id: notEquals(1)})
 */
export const notEquals = (v) => new NotEqualsFilter(v);


/**
 * Creates a new filter for testing if a value is less than another value.
 *
 * @param {*} value - the value to filter
 * @returns {LessThanFilter} filter instance
 * @example
 * let user = await User.find({id: lessThan(1)})
 */
export const lessThan = (v) => new LessThanFilter(v);


/**
 * Creates a new filter for testing if a value is less than, or equal to
 * another value.
 *
 * @param {*} value - the value to filter
 * @returns {LessThanOrEqualToFilter} filter instance
 * @example
 * let user = await User.find({id: lessThanOrEqualTo(1)})
 */
export const lessThanOrEqualTo = (v) => new LessThanOrEqualToFilter(v);


/**
 * Creates a new filter for testing if a value is greater than another value.
 *
 * @param {*} value - the value to filter
 * @returns {GreaterThanFilter} filter instance
 * @example
 * let user = await User.find({id: greaterThan(1)})
 */
export const greaterThan = (v) => new GreaterThanFilter(v);


/**
 * Creates a new filter for testing if a value is greater than, or equal to
 * another value.
 *
 * @param {*} value - the value to filter
 * @returns {GreaterThanOrEqualToFilter} filter instance
 * @example
 * let user = await User.find({id: greaterThanOrEqualTo(1)})
 */
export const greaterThanOrEqualTo = (v) => new GreaterThanOrEqualToFilter(v);


/**
 * Creates a new filter for testing if a value matches one of a specificed list
 *
 * @param {*} value - the value to filter
 * @returns {IncludesFilter} filter instance
 * @example
 * let user = await User.find({id: includes([1, 3, 5])})
 */
export const includes = (v) => new IncludesFilter(v);


/**
 * Creates a new filter to check that a value does not match any values in a
 * specificed list
 *
 * @param {*} value - the value to filter
 * @returns {ExcludesFilter} filter instance
 * @example
 * let user = await User.find({id: excludes([1, 3, 5])})
 */
export const excludes = (v) => new ExcludesFilter(v);


/**
 * Creates a new filter to check that a value falls between two fixed values.
 * The test values are not inclusive.
 *
 * @param {*} value - the value to filter
 * @returns {BetweenFilter} filter instance
 * @example
 * let user = await User.find({id: between(1, 5)})
 */
export const between = (v1, v2) => new BetweenFilter(v1, v2);


/**
 * Creates a new filter to check that a value does not fall between two fixed
 * values. The test values are not inclusive.
 *
 * @param {*} value - the value to filter
 * @returns {NotBetweenFilter} filter instance
 * @example
 * let user = await User.find({id: notBetween(1, 10)})
 */
export const notBetween = (v1, v2) => new NotBetweenFilter(v1, v2);

