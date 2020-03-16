
module.exports = (options) => {

  var data = [];

  return {
    find: async (type, bindings, filters) => {
      if (data[type]) {
        return data[type].entries;
      }
      return [];
    },

    create: async (type, bindings, values) => {
      if (!data[type]) {
        data[type] = {
          nextId: 1,
          entries: []
        };
      }
      let id = data[type].nextId;
      data[type].entries.push(values);
      data[type].nextId++;
      values[bindings.getIdentifierName()] = id;
      return id;
    },

    update: (type, bindings, values, filters) => {
      return true;
    },

    delete: (type, bindings, filters) => {
      console.log(filters)
      return true;
    }
  }
}
