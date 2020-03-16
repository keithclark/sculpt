module.exports = class TypeDefinition {
  constructor(model) {
    this.model = model;
  }

  set provider(provider) {
    this._provider = provider;
  }

  get provider() {
    return this._provider;
  }
}
