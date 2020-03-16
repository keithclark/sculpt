const Model = require('./Model');
const BindingMap = require('./bindingMap');
const TypeDefinition = require('./TypeDefinition');
const Provider = require('./Provider');
const SculptError = require('./SculptError');
const { getObjectName } = require('./utils');
const { assertTypeOf, assertTypeCanBeModelled } = require('./assert');


module.exports = () => {

  const typeDefinitions = new WeakMap();
  const properties = {};


  /**
   * Asserts that a type has been modelled with `scupt.model`
   *
   * @param {*} type
   */
  const assertTypeIsModelled = type => {
    if (!typeDefinitions.has(type)) {
      assertTypeCanBeModelled(type);
      throw new SculptError(`No model for type '${getObjectName(type)}'`);
    }
  };


  /**
   * Asserts that the given type has a model and provider so it can be connected
   * to a data source.
   *
   * @param {*} type
   */
  const getModelAndProviderForType = type => {
    assertTypeIsModelled(type);
    let {model, provider} = typeDefinitions.get(type);
    if (!provider) {
      throw new SculptError(`No provider for type '${getObjectName(type)}'`);
    }
    return {model, provider};
  };


  /**
   * Set a provider
   *
   * @param {Object} provider - Provider
   * @param {Class|Class[]} [type] - Type of
   */
  const provider = (provider, types) => {
    assertTypeOf(provider, Provider, 'provider');

    if (!Array.isArray(types)) {
      types = [types];
    }
    types.forEach(type => {
      assertTypeIsModelled(type);
      typeDefinitions.get(type).provider = provider;
    });
  };


  /**
   * Set a sculpt-level configuration property
   *
   * @param {*} property
   * @param {*} value
   */
  const set = (property, value) => {
    properties[property] = value;
  };


  /**
   * Get a sculpt-level configuration property
   *
   * @param {*} property
   */
  const get = (property) => {
    return properties[property];
  };


  /**
   *
   * @param {*} type
   * @param {*} bindings
   * @param {*} options
   */
  const model = (type, bindings, options = {}) => {

    assertTypeCanBeModelled(type);
    assertTypeOf(bindings, Object, 'property bindings');
    assertTypeOf(options, Object, 'options');

    let bindingMap = new BindingMap(bindings);
    let model = new Model(type, bindingMap);
    let definition = new TypeDefinition(model);
    typeDefinitions.set(type, definition);

    if (options.provider) {
      provider(options.provider, type);
    }

    if (options.decorate === true || (properties.decorate === true && options.decorate !== false)) {
      decorate(type);
    }
  };


  /**
   * Add sculpt syntactic sugar to an object exposing `Class.find()`,
   * `instance.save()` and `instance.delete()`
   *
   * @param {Object} type - The object to decorate
   */
  const decorate = type => {

    assertTypeIsModelled(type);

    // static methods
    Object.assign(type, {
      find: find.bind(null, type)
    });

    // instance methods
    Object.assign(type.prototype, {
      save: function() {
        return commit(this);
      },
      delete: function() {
        return destroy(this);
      }
    });
  };


  /**
   * Retreive a model
   *
   * @param {Object} type - The model type to search for
   * @param {Object} [filters] - The parameters to filter against
   * @param {Object} [order] - The sort order to return results in
   */
  const find = async (type, filters, order) => {
    let {model, provider} = getModelAndProviderForType(type);
    return model.find(provider, filters, order);
  };


  /**
   * Permanently remove an object from the data store
   *
   * @param {*} instance
   */
  const destroy = async (instance) => {
    let {model, provider} = getModelAndProviderForType(instance.constructor);
    return model.delete(provider, instance);
  };


  /**
   * Commit some data
   *
   * @param {*} instance
   */
  const commit = async (instance) => {
    let {model, provider} = getModelAndProviderForType(instance.constructor);
    return model.commit(provider, instance);
  };


  /**
   *
   * @param {*} instance
   */
  const validate = (instance) => {
    let type = instance.constructor;
    assertTypeIsModelled(type);
    let {model} = typeDefinitions.get(type);
    let boundValues = model.bindings.getObjectValues(instance);
    model.validateValues(boundValues);
  };


  return {
    set,
    get,
    decorate,
    provider,
    model,
    find,
    delete: destroy,
    commit,
    validate
  };
};
