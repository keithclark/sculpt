import IdentityBinding from './bindings/Identity.js';
import IntegerBinding from './bindings/Integer.js';
import StringBinding from './bindings/String.js';
import DateBinding from './bindings/Date.js';
import BoooleanBinding from './bindings/Boolean.js';


/**
 * @param {import('./bindings/String').StringBindingOptions} options
 */
export const string = options => new StringBinding(options);


/**
 * @param {import('./Binding').BindingOptions} options
 */
export const integer = options => new IntegerBinding(options);


/**
 * @param {import('./Binding').BindingOptions} options
 */
export const identity = options => new IdentityBinding(options);


/**
 * @param {import('./Binding').BindingOptions} options
 */
export const date = options => new DateBinding(options);


/**
 * @param {import('./Binding').BindingOptions} options
 */
export const boolean = options => new BoooleanBinding(options);
