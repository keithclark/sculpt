const SculptError = require('../SculptError');

module.exports = class BindingNotFoundError extends SculptError {
  constructor(bindingName) {
    super(`No binding found for property '${bindingName}'`);
  }
};
