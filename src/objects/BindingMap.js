import IdentityBinding from '../bindings/Identity.js';
import Binding from './Binding.js';
import {assertTypeOf, assertMapKeyExists, assertIsNull} from '../assert.js';
import SculptError from './SculptError.js';

/**
 * Binding maps represent the link between a property name and and a Binding
 */
export default class BindingMap {

  constructor(bindings) {
    this._bindings = new Map();
    if (bindings) {
      this.set(bindings);
    }
  }

  /**
   * Sets the bindngs
   *
   * @param {Object} bindings
   */
  set(bindings) {
    this._indentName = null;
    this._bindings.clear();
    Object.entries(bindings).forEach(([name, binding]) => {
      assertTypeOf(binding, Binding, 'binding');
      this._bindings.set(name, binding);
      if (binding instanceof IdentityBinding) {
        assertIsNull(this._indentName, 'A model can only have a single binding');
        this._indentName = name;
      }
    });
    this._bindingNames = [...this._bindings.keys()];
  }

  ensure(name) {
    assertMapKeyExists(this._bindings, name, `No binding exists for property '${name}'`);
  }

  get(name) {
    this.ensure(name);
    return this._bindings.get(name);
  }

  getIdentifierName() {
    return this._indentName;
  }

  get identityName() {
    return this._indentName;
  }

  get names() {
    return this._bindingNames;
  }

  /**
   * Use the binding definitions to set the property values on an object
   *
   * @param {*} obj
   * @param {*} values
   */
  setObjectValues(obj, values) {
    this._bindingNames.forEach(name => {
      if (values.hasOwnProperty(name)) {
        obj[name] = values[name];
      }
    });
  }

  /**
   * Use the binding definitions to extract property values from an object
   *
   * @param {*} obj
   * @param {*} values
   */
  getObjectValues(obj) {
    let values = {};
    this._bindingNames.forEach(name => {
      if (obj.hasOwnProperty(name)) {
        values[name] = obj[name];
      } else {
        values[name] = undefined;
      }
    });
    return values;
  }

  [Symbol.iterator]() {
    return this._bindings[Symbol.iterator]();
  }
}
