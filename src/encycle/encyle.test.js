import { encycle, isRef } from "./encycle";
import { getDummyData } from "../testHelpers";

describe("encycle", () => {
  beforeEach(() => jest.resetAllMocks());

  describe("encodes circular references", () => {
    let dummyData;

    beforeEach(() => {
      jest.resetAllMocks();

      dummyData = getDummyData();
    });

    describe("isRef", () => {
      it("should return `false` if the passed value is not an object", () => {
        expect(isRef(null)).toEqual(false);
      });

      it("should return `false` if the passed object doesn't have the key `$ref`", () => {
        expect(isRef({ foo: "bar" })).toEqual(false);
      });

      it("should return `false` if the passed object has more than one enumerable key", () => {
        expect(isRef({ $ref: "$", foo: "bar" })).toEqual(false);
      });

      it("should return `false` if the passed object has a `$ref` value of `null`", () => {
        expect(isRef({ $ref: null })).toEqual(false);
      });

      it("should return `false` if the passed object has a null key of `$ref`", () => {
        expect(isRef({ $ref: null })).toEqual(false);
      });

      it("should return `true` if the passed object matches the object literal `{ $ref: '' }`", () => {
        expect(isRef({ $ref: "$", foo: "bar" })).toEqual(false);
      });
    });

    describe("re-inserts circular data", () => {
      it("should return the same data if no JSONPath refs found", () => {
        expect(encycle(dummyData)).toEqual(dummyData);
      });

      it("should handle JSONPaths for simple arrays", () => {
        const arr = [1, "a", { $ref: "$" }];

        expect(arr[2] === arr).toBe(false);

        encycle(arr);

        expect(arr[2] === arr).toBe(true);
      });

      it("should handle JSONPaths for complex nested arrays", () => {
        const arr = [1, ["a", [{ $ref: "$[1][1]" }]]];

        expect(arr[1][1][0] === arr[1][1]).toBe(false);

        encycle(arr);

        expect(arr[1][1][0] === arr[1][1]).toBe(true);
      });

      it("should handle JSONPaths for simple objects", () => {
        const obj = { foo: "bar", faz: { $ref: "$" } };

        expect(obj.faz === obj).toBe(false);

        encycle(obj);

        expect(obj.faz === obj).toBe(true);
      });

      it("should handle JSONPaths for handle complex nested objects", () => {
        const obj = {
          firstName: dummyData.firstName,
          lastName: dummyData.lastName,
          age: dummyData.age,
          address: {
            ...dummyData.address,
            postalCode: { $ref: "$.address" },
          },
        };

        expect(obj.address.postalCode === obj.address).toBe(false);

        encycle(obj);

        expect(obj.address.postalCode === obj.address).toBe(true);
      });

      it("should handle JSONPaths which represent a combination of objects and arrays", () => {
        dummyData.phoneNumbers[1].number = { $ref: "$.phoneNumbers[1]" };

        expect(
          dummyData.phoneNumbers[1].number == dummyData.phoneNumbers[1]
        ).toBe(false);

        encycle(dummyData);

        expect(
          dummyData.phoneNumbers[1].number == dummyData.phoneNumbers[1]
        ).toBe(true);
      });

      it("should handle data which contains multiple complex JSONPaths", () => {
        dummyData.address.streetAddress = { $ref: "$" };
        dummyData.address.country = { $ref: "$.address" };
        dummyData.phoneNumbers[1].number = { $ref: "$.phoneNumbers[1]" };

        expect(dummyData.address.streetAddress === dummyData).toBe(false);
        expect(dummyData.address.country === dummyData.address).toBe(false);
        expect(
          dummyData.phoneNumbers[1].number === dummyData.phoneNumbers[1]
        ).toBe(false);

        encycle(dummyData);

        expect(dummyData.address.streetAddress === dummyData).toBe(true);
        expect(dummyData.address.country === dummyData.address).toBe(true);
        expect(dummyData.phoneNumbers[1] === dummyData.phoneNumbers[1]).toBe(
          true
        );
      });

      it("should throw an error if the data is stringified after `encyle` is called", () => {
        const error = "Converting circular structure to JSON";
        const arr = [1, "a", { $ref: "$" }];

        expect(() => JSON.stringify(arr)).not.toThrow(error);

        encycle(arr);

        expect(() => JSON.stringify(arr)).toThrow(error);
      });
    });
  });
});
