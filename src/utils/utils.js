export const isArray = value => Array.isArray(value);

export const isObject = value =>
  Object.prototype.toString.call(value).slice(8, -1) === "Object";
