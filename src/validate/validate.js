import { isArray, isObject } from "../utils";

export const validate = (value) => {
  if (typeof value === "undefined") {
    throw new Error("This method requires one parameter");
  }

  if (!isArray(value) && !isObject(value)) {
    throw new TypeError("This method only accepts arrays and objects");
  }
};

export default validate;
