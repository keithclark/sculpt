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
   *
   * @param {*} filters
   */
  validateFilters(filters) {
    if (filters) {
      Object.keys(filters).forEach(name => this.bindings.ensure(name));
    }
  }


  /**
   *
   * @param {*} order
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
   *
   * @param {*} values
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
   *
   * @param {*} instance
   */
  validateInstance(instance) {
    // Check the type of instance we're about to commit is compatible.
    if (!(instance instanceof this.type)) {
      throw new SculptError('Invalid instance');
    }
  }


  /**
   *
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
   * Retrieve a filtered list of models
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
   * Commit a model to a data provider. If the model being committed was
   * previouly retrieved from the provider then it will be amended. If the model
   * is new, it will be added.
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
