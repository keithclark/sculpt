const InvalidBindingValueError = require('./errors/InvalidBindingValueError');

class Model {

  /**
   *
   * @param {Class} type - The class to be modeled
   * @param {BindingMap} bindings - The binding list to model against
   * @param {Provider} [provider] - The provider used to store the model data
   */
  constructor(type, bindings) {
    this.type = type;
    this.bindings = bindings;
    this._modelIdMap = new WeakMap();
    this._modelPendingCommitSet = new WeakSet();
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
          throw new Error(`Invalid sort value '${value}' for binding '${name}'.`);
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
      throw new Error('Invalid instance');
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
      throw new Error('An identity binding is required to commit');
    }

    // Ensure that the identity of this resource hasn't been tampered with. This
    // guards against new model instances having a ID directly assigned to them
    // or existing models having their ID changed.
    let id = this._modelIdMap.get(instance);
    if (instance[identityName] !== id) {
      throw new Error('Identity binding values cannot be set externally');
    }
  }


  /**
   * Retrieve a filtered list of models
   *
   * @param {Object} [filters]
   * @param {Object} [order]
   */
  find(provider, filters, order) {
    let {bindings} = this;
    this.validateFilters(filters);
    this.validateOrder(order);
    return provider.find(filters, bindings).then(results => {
      return results.map(result => this.createInstance(result));
    });
  }


  /**
   *
   * @param {*} instance
   */
  async delete(provider, instance) {
    let {bindings} = this;
    let {identityName} = bindings;

    this.validateInstance(instance);
    this.validateIdentity(instance);

    let id = instance[identityName];

    if (!id) {
      return false;
    }


    let filters = {[identityName]: instance[identityName]};
    if (await provider.delete(filters, bindings)) {
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
  async commit(provider, instance) {
    let {bindings} = this;

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
      throw new Error('Unable to commit this model because the provider is already committing changes to it.');
    }

    // lock the resource
    this._modelPendingCommitSet.add(instance);

    // If there's no ID, this must be a new instance
    if (!id) {
      id = await provider.create(boundValues, bindings);
      instance[identityName] = id;
      this._modelIdMap.set(instance, id);
      this._modelPendingCommitSet.delete(instance);
      return true;
    }

    let filters = {[identityName]: id};
    await provider.update(filters, boundValues, bindings);
    this._modelPendingCommitSet.delete(instance);
    return true;
  }

}


module.exports = Model;
