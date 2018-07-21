import { isArray, isObject } from "../utils";
import validate from "../validate";

export const findRef = (ref, visitedRefs) =>
  Object.keys(visitedRefs).find(key => visitedRefs[key] === ref);

export const decycle = arg => {
  validate(arg);

  let visitedRefs = {};

  const recurs = (value, path = "$") => {
    const ref = findRef(value, visitedRefs);

    if (ref) {
      return { $ref: ref };
    }

    if (isArray(value) || isObject(value)) {
      visitedRefs[path] = value;

      if (isArray(value)) {
        return value.map((elem, i) => recurs(elem, `${path}[${i}]`));
      }

      return Object.keys(value).reduce((accum, key) => {
        accum[key] = recurs(value[key], `${path}.${key}`);

        return accum;
      }, {});
    }

    return value;
  };

  return recurs(arg);
};

export default decycle;
