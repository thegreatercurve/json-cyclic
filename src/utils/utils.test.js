import { isArray, isObject } from "../utils";

describe("utils", () => {
  beforeEach(() => jest.resetAllMocks());

  describe("isArray", () => {
    it("should stricly only return `true` for an array", () => {
      expect(isArray({})).toBe(false);

      expect(isArray([])).toBe(true);
      expect(isArray(() => null)).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isArray(Date)).toBe(false);
      expect(isArray(Set)).toBe(false);
      expect(isArray(Symbol)).toBe(false);
      expect(isArray(JSON)).toBe(false);
    });
  });

  describe("isObject", () => {
    it("should stricly only return `true` for an object literal", () => {
      expect(isObject({})).toBe(true);

      expect(isObject([])).toBe(false);
      expect(isObject(() => null)).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject(Date)).toBe(false);
      expect(isObject(Set)).toBe(false);
      expect(isObject(Symbol)).toBe(false);
      expect(isObject(JSON)).toBe(false);
    });
  });
});
