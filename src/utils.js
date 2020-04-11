export const getObjectName = (obj) => {
  if (typeof obj === 'function' && obj.name) {
    return obj.name;
  }
  return typeof obj;
}
