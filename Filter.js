/**
 * Filters are used by Providers to find data. They have a single `test()`
 * method that providers can optionally call against an array of data they
 * retrieve from a data store. Some providers (mysql, for example) can filter
 * at the data source by constructing and executing statements and therefore
 * won't ever call the `test()` method. Instead, these providers use
 * `instanceof SomeFilter` while constructing statements.
 */

module.exports = class Filter {

  constructor(value) {
    this.value = value;
  }

  test() {

  }
};
