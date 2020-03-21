/**
 * A Provider connects a model to a data store, allowing instances of the
 * modelled class to be created from a persisted state. For example, your
 * application may define a User class and store user data in a mysql database.
 * Using the mysql provider you can create an instance of the User class with
 * its properties populated from a record in the database. Internally, the mysql
 * provider constructs a SQL SELECT statement using the model bindings and
 * executes it against the database.
 *
 * Providers have the same signature which allows them to be swapped out. For
 * example, you could start building an application by creating a stubbed data
 * provider, then switch to a provider that integrates with mysql, mongoDB or a
 * RESTful API at a later date. Switching providers can be useful for unit
 * testing.
 *
 * Reading data from a provider is done with the `sculpt.find` method. Providers
 * can also write back to, and delete from, the data store using `sculpt.commit`
 * and `sculpt.delete`.
 *
 * Sculpt requires providers to extend the `Provider` base class.
 */

const SculptError = require('./SculptError');

const notImplemented = method => {
  throw new SculptError(`Provider.${method}() - method not implemented`);
}

module.exports = class Provider {
  /**
   * Retreive data from a data store. The result should be a key/value list.
   * The Model this provider is connected to will use these values when creating
   * a new instance to populate its properties.
   *
   * @param {Object} [filters] - The bindings to filter against
   * @param {BindingMap} [bindings] - The bindings for the model
   * @returns {Promise} - A promise that resolves with data
   */
  async find(filters, bindings) {
    notImplemented('find');
  }

  /**
   * Creates a new entry in a data store. If the store tracks data by with a
   * unique identifier (an ID field in a database for example), then this value
   * must be returned.
   *
   * @param {Object} values - An object containing the values to set
   * @param {BindingMap} [bindings] - The bindings for the model
   * @returns {Promise} - A promise that resolves with the stores ID for the object.
   */
  async create(values, bindings) {
    notImplemented('create');
  }

  /**
   * Update one or more entries in a data store.
   *
   * @param {Object} [filters] - The values to filter against
   * @param {Object} values - An object containing the new values
   * @param {BindingMap} [bindings] - The bindings for the model
   */
  update(filters, boundValues, bindings) {
    notImplemented('update');
  }

  /**
   * Deletes one or more entries from the data store
   *
   * @param {Object} [filters] - The bindings to filter against
   */
  delete(filters, bindings) {
    notImplemented('delete');
  }

}
