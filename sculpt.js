const Model = require('./Model');
const BindingMap = require('./bindingMap');
const Provider = require('./Provider');
const SculptError = require('./SculptError');
const { getObjectName } = require('./utils');
const { assertTypeOf, assertTypeCanBeModelled } = require('./assert');


module.exports = () => {

  const modelMap = new WeakMap();
  const properties = {};


  /**
   * Asserts that a type has been modelled with `scupt.model`
   *
   * @param {*} type
   */
  const assertTypeIsModelled = type => {
    if (!modelMap.has(type)) {
      assertTypeCanBeModelled(type);
      throw new SculptError(`No model for type '${getObjectName(type)}'`);
    }
  };


  /**
   * Set a data provider for one or more models
   *
   * @param {Object} provider - Provider
   * @param {Class|Class[]} [type] - Type of
   */
  const provider = (provider, types) => {
    if (!Array.isArray(types)) {
      types = [types];
    }
    types.forEach(type => {
      getModelByType(type).provider = provider;
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
    modelMap.set(type, model);

    if (options.provider) {
      model.provider = type;
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


  const getModelByType = type => {
    assertTypeIsModelled(type)
    return modelMap.get(type);
  }

  /**
   * Retreive a model
   *
   * @param {Object} type - The model type to search for
   * @param {Object} [filters] - The parameters to filter against
   * @param {Object} [order] - The sort order to return results in
   */
  const find = async (type, filters, order) => {
    return getModelByType(type).find(filters, order);
  };


  /**
   * Permanently remove an object from the data store
   *
   * @param {*} instance
   */
  const destroy = async (instance) => {
    return getModelByType(instance.constructor).delete(instance);
  };


  /**
   * Commit some data
   *
   * @param {*} instance
   */
  const commit = async (instance) => {
    return getModelByType(instance.constructor).commit(instance);
  };


  /**
   *
   * @param {*} instance
   */
  const validate = (instance) => {
    let model = getModelByType(instance.constructor);
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
