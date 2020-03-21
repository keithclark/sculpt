/**
 * Modelling is how classes are described to Sculpt. A modelled class can be
 * instantiated, validated and, if configured, persisted through a provider.
 */

const SculptError = require('./SculptError');
const InvalidBindingValueError = require('./errors/InvalidBindingValueError');
const { assertModelHasProvider, assertValidProvider } = require('./assert');


class Model {

  /**
   *
   * @param {Class} type - The class to be modeled
   * @param {BindingMap} bindings - The binding list to model against
   */
  constructor(type, bindings) {
    this.type = type;
    this.bindings = bindings;
    this._provider = null;
    this._modelIdMap = new WeakMap();
    this._modelPendingCommitSet = new WeakSet();
  }


  /**
   * Sets the data provider for this model. If `null` is passed, the current
   * provider is removed.
   *
   * @param {Provider} provider - The provider to use for accessing a data store
   */
  set provider(provider) {
    if (provider !== null) {
      assertValidProvider(provider);
    }
    this._provider = provider;
  }


  /**
   * Gets the data provider for this model.
   *
   * @returns {Provider|null} The current provider
   */
  get provider() {
    return this._provider;
  }


  /**
   * Create a new model instance and optionally set its properties.
   *
   * @param {Object} [values] A key/value map of property names/values
   */
  createInstance(values) {
    let {type} = this;
    let instance = new type();
    this.bindings.setObjectValues(instance, values);
    return instance;
  }


  /**
   * Ensures an object of key/value filters are valid for this model.
   *
   * @param {Object} filters - Filters to validate
   */
  validateFilters(filters) {
    if (filters) {
      Object.keys(filters).forEach(name => this.bindings.ensure(name));
    }
  }


  /**
   * Ensures an object of key/value sort orders are valid for this model.
   *
   * @param {Object} order - Orders to validate
   */
  validateOrder(order) {
    if (order) {
      Object.entries(order).forEach(([name, value]) => {
        this.bindings.ensure(name);
        if (value !== 'asc' && value !== 'desc') {
          throw new SculptError(`Invalid sort value '${value}' for binding '${name}'.`);
        }
      });
    }
  }


  /**
   * Ensures an object of key/value pairs are valid for this model.
   *
   * @param {Object} values - Values to validate
   */
  validateValues(values) {
    Object.entries(values).forEach(([name, value]) => {
      let error = this.bindings.get(name).validate(value)
      if (error) {
        throw new InvalidBindingValueError(name, value, error);
      };
    });
  }


  /**
   * Ensure an instance is modelled by this model. Throws an error is the
   * instance is incompatible.
   *
   * @param {*} instance - The object instance to validate
   */
  validateInstance(instance) {
    // Check the type of instance we're about to commit is compatible.
    if (!(instance instanceof this.type)) {
      throw new SculptError('Invalid instance');
    }
  }


  /**
   * Ensure an instance has an identity and that it has not been tampered with.
   *
   * @param {*} instance - The object instance to validate
   */
  validateIdentity(instance) {
    let {identityName} = this.bindings;

    // Ensure we have an identity field. Without one, we won't be able to
    // uniquely identify this resource when we want to retrieve it later.
    if (!identityName) {
      throw new SculptError('An identity binding is required to commit');
    }

    // Ensure that the identity of this resource hasn't been tampered with. This
    // guards against new model instances having a ID directly assigned to them
    // or existing models having their ID changed.
    let id = this._modelIdMap.get(instance);
    if (instance[identityName] !== id) {
      throw new SculptError('Identity binding values cannot be set externally');
    }
  }


  /**
   * Retrieve a filtered list of model instances from a data store useing the
   * configured provider.
   *
   * @param {Object} [filters]
   * @param {Object} [order]
   */
  find(filters, order) {
    assertModelHasProvider(this);
    let {bindings} = this;
    let {identityName} = bindings;

    this.validateFilters(filters);
    this.validateOrder(order);
    return this.provider.find(filters, bindings).then(results => {
      return results.map(result => {
        let instance = this.createInstance(result);
        this._modelIdMap.set(instance, instance[identityName]);
        return instance;
      });
    });
  }


  /**
   * Delete an instance of the modelled class from a data store using the
   * configured provider. If no provider is configured an error will be thrown.
   *
   * @param {*} instance
   */
  async delete(instance) {
    let {bindings} = this;
    let {identityName} = bindings;
    assertModelHasProvider(this);

    this.validateInstance(instance);
    this.validateIdentity(instance);

    let id = instance[identityName];

    if (!id) {
      return false;
    }

    let filters = {[identityName]: instance[identityName]};
    if (await this.provider.delete(filters, bindings)) {
      this._modelIdMap.delete(instance);
      return true;
    }
    return false;
  }


  /**
   * Commit a model instance to a data store using the configured provider. If
   * the instance was previouly retrieved from the provider then it will be
   * amended. If the instance is new, it will be added to the store by the
   * provider. If no provider is configured an error will be thrown.
   *
   * @param {Object} instance
   */
  async commit(instance) {
    let {bindings} = this;

    assertModelHasProvider(this);

    this.validateInstance(instance);
    this.validateIdentity(instance);

    let {identityName} = bindings;

    // Read the bound values from the instance and validate their content
    let boundValues = bindings.getObjectValues(instance);
    this.validateValues(boundValues);

    let id = instance[identityName];

    // If there's a commit in progress for this instance then throw an error.
    // This is likely to be caused by a missing `await`
    if (this._modelPendingCommitSet.has(instance)) {
      throw new SculptError('Unable to commit this model because the provider is already committing changes to it.');
    }

    // lock the resource
    this._modelPendingCommitSet.add(instance);

    // If there's no ID, this must be a new instance
    if (!id) {
      id = await this.provider.create(boundValues, bindings);
      instance[identityName] = id;
      this._modelIdMap.set(instance, id);
    } else {
      let filters = {[identityName]: id};
      await this.provider.update(filters, boundValues, bindings);
    }

    // unlock the resource
    this._modelPendingCommitSet.delete(instance);
    return true;
  }
}

module.exports = Model;
