import { decycle, findRef } from "./decycle";
import { getDummyData } from "../testHelpers";

describe("decycle", () => {
  let dummyData;

  beforeEach(() => {
    jest.resetAllMocks();

    dummyData = getDummyData();
  });

  describe("findRef", () => {
    it("should return the found ref if it exists in the provided object of `visitedRefs`", () => {
      const obj = { foo: "bar" };

      const visitedRefs = { $: obj };

      expect(findRef(obj, visitedRefs)).toEqual("$");
    });
  });

  describe("detects and adds circular references", () => {
    it("should return the same data if no circular data is found", () => {
      expect(decycle(dummyData)).toEqual(dummyData);
    });

    it("should handle simple arrays", () => {
      const arr = [1, "a"];

      arr[2] = arr;

      expect(decycle(arr)).toEqual([1, "a", { $ref: "$" }]);
    });

    it("should handle complex nested arrays", () => {
      const arr = [1, "a", [1, "a", [3]]];

      arr[2][2][1] = arr[2][2];

      expect(decycle(arr)).toEqual([
        1,
        "a",
        [1, "a", [3, { $ref: "$[2][2]" }]],
      ]);
    });

    it("should handle simple objects", () => {
      const obj = { foo: "bar" };

      obj["faz"] = obj;

      expect(decycle(obj)).toEqual({
        ...obj,
        faz: { $ref: "$" },
      });
    });

    it("should handle complex nested objects", () => {
      const obj = {
        firstName: dummyData.firstName,
        lastName: dummyData.lastName,
        age: dummyData.age,
        address: dummyData.address,
      };

      obj.address.postalCode = obj.address;

      expect(decycle(obj)).toEqual({
        ...obj,
        address: {
          ...obj.address,
          postalCode: { $ref: "$.address" },
        },
      });
    });

    it("should handle a combination of objects and arrays", () => {
      dummyData.phoneNumbers[1].number = dummyData.phoneNumbers[1];

      expect(decycle(dummyData)).toEqual({
        ...dummyData,
        phoneNumbers: [
          ...dummyData.phoneNumbers.slice(0, -1),
          {
            ...dummyData.phoneNumbers[1],
            number: { $ref: "$.phoneNumbers[1]" },
          },
        ],
      });
    });

    it("should handle multiple circular references", () => {
      dummyData.address.streetAddress = dummyData;
      dummyData.address.country = dummyData.address;
      dummyData.phoneNumbers[1].number = dummyData.phoneNumbers[1];

      expect(decycle(dummyData)).toEqual({
        ...dummyData,
        address: {
          ...dummyData.address,
          streetAddress: { $ref: "$" },
          country: { $ref: "$.address" },
        },
        phoneNumbers: [
          ...dummyData.phoneNumbers.slice(0, -1),
          {
            ...dummyData.phoneNumbers[1],
            number: { $ref: "$.phoneNumbers[1]" },
          },
        ],
      });
    });

    it("should no longer throw an error if the data is stringified after `decycle` is called", () => {
      const error = "Converting circular structure to JSON";
      let arr = [1, "a"];

      arr[2] = arr;

      expect(() => JSON.stringify(arr)).toThrow(error);

      arr = decycle(arr);

      expect(() => JSON.stringify(decycle(arr))).not.toThrow(error);
    });
  });
});
