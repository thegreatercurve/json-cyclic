import { isArray, isObject } from "../utils";
import validate from "../validate";

export const isRef = (value) =>
  isObject(value) &&
  value.hasOwnProperty("$ref") &&
  Object.keys(value).length === 1 &&
  !!value.$ref &&
  value.$ref.charAt(0) === "$";

export const encycle = (arg) => {
  validate(arg);

  const recurs = (value) => {
    if (isArray(value) || isObject(value)) {
      if (isArray(value)) {
        return value.map((elem, i) => {
          if (isRef(elem)) {
            value[i] = eval("arg" + elem.$ref.slice(1));

            return value;
          }

          return recurs(elem);
        });
      }

      return Object.keys(value).reduce((accum, key) => {
        if (isRef(value[key])) {
          accum[key] = eval("arg" + value[key].$ref.slice(1));
        } else {
          accum[key] = recurs(value[key]);
        }

        return accum;
      }, value);
    }

    return value;
  };

  return recurs(arg);
};

export default encycle;
