const notImplemented = method => {
  throw new Error(`Provider.${method}() - method not implemented`);
}

module.exports = class Provider {
  find() {
    notImplemented('find');
  }

  create() {
    notImplemented('create');
  }

  update() {
    notImplemented('update');
  }

  delete() {
    notImplemented('delete');
  }
}
