const IdentityBinding = require('./bindings/Identity');
const IntegerBinding = require('./bindings/Integer');
const StringBinding = require('./bindings/String');
const DateBinding = require('./bindings/Date');
const BoooleanBinding = require('./bindings/Boolean');


/**
 * @param {import('./bindings/String').StringBindingOptions} options
 */
module.exports.string = options => new StringBinding(options);


/**
 * @param {import('./Binding').BindingOptions} options
 */
module.exports.integer = options => new IntegerBinding(options);


/**
 * @param {import('./Binding').BindingOptions} options
 */
module.exports.identity = options => new IdentityBinding(options);


/**
 * @param {import('./Binding').BindingOptions} options
 */
module.exports.date = options => new DateBinding(options);


/**
 * @param {import('./Binding').BindingOptions} options
 */
module.exports.boolean = options => new BoooleanBinding(options);
