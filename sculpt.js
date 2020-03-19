const Model = require('./Model');
const BindingMap = require('./BindingMap');
const SculptError = require('./SculptError');
const { getObjectName } = require('./utils');
const { assertTypeOf, assertTypeCanBeModelled } = require('./assert');


module.exports = () => {

  const modelMap = new WeakMap();
  const properties = {};


  /**
   * Asserts that a type has been modelled with `scupt.model`. Throws a
   * `SculptError` if no model could be found
   *
   * @private
   * @param {Class} type - the type to check
   */
  const assertTypeIsModelled = type => {
    if (!modelMap.has(type)) {
      assertTypeCanBeModelled(type);
      throw new SculptError(`No model for type '${getObjectName(type)}'`);
    }
  };


  /**
   * Retrieve the model for a given class. Throws an error if no model could be
   * found.
   *
   * @private
   * @param {Class} type — the class to get the model of
   */
  const getModelByType = type => {
    assertTypeIsModelled(type);
    return modelMap.get(type);
  }


  /**
   * Set a data provider for one or more models
   *
   * @param {Provider} provider - The provider responsible for serving data
   * @param {Class|Class[]} [type] - Casses the provider will service
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
   * @param {string} property - the name of the property to set
   * @param {*} value - the new value for the property
   */
  const set = (property, value) => {
    properties[property] = value;
  };


  /**
   * Get a sculpt-level configuration property
   *
   * @param {string} property - the property to return
   * @returns {*} The property value
   */
  const get = (property) => {
    return properties[property];
  };


  /**
   * Model a class with sculpt by defining its bindings.
   *
   * @param {Class} type - the class to model
   * @param {*} bindings - the property bindings to model
   * @param {*} options - additional configuration options
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
   * @param {Class} type - The class to decorate
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
   * Retreive a model from a data store
   *
   * @param {Class} type - The model type to search for
   * @param {Object} [filters] - The parameters to filter against
   * @param {Object} [order] - The sort order to return results in
   */
  const find = async (type, filters, order) => {
    return getModelByType(type).find(filters, order);
  };


  /**
   * Permanently remove an object from the data store
   *
   * @param {Class} instance - the instance to remove
   */
  const destroy = async (instance) => {
    return getModelByType(instance.constructor).delete(instance);
  };


  /**
   * Commits the property values of modelled class to a data store
   *
   * @param {Class} instance - the instance to commit
   */
  const commit = async (instance) => {
    return getModelByType(instance.constructor).commit(instance);
  };


  /**
   * Validates an modelled class against its bindinds. Throws an error
   * if validation fails
   *
   * @param {Class} instance
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
