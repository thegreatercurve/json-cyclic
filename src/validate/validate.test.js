import validate from "./validate";

describe("validate", () => {
  beforeEach(() => jest.resetAllMocks());

  const JSON_TYPES = {
    ARRAY: [],
    BOOLEAN: true,
    NUMBER: 10,
    OBJECT: {},
    STRING: "foo",
    NULL: null,
  };

  it("should only accept an `arg` of either type `array` or `object`", () => {
    expect(() => validate(JSON_TYPES.ARRAY)).not.toThrow();
    expect(() => validate(JSON_TYPES.OBJECT)).not.toThrow();
  });

  it("should throw an error if `arg` is `undefined`", () => {
    const errorMessage = "This method requires one parameter";

    expect(() => validate()).toThrow(Error, errorMessage);
  });

  it("should throw a type error if `arg` is of neither type `array` or `object`", () => {
    const errorMessage =
      "TypeError: This method only accepts arrays and objects";

    Object.keys(JSON_TYPES).map((type) => {
      if (
        JSON_TYPES[type] !== JSON_TYPES.ARRAY &&
        JSON_TYPES[type] !== JSON_TYPES.OBJECT
      ) {
        expect(() => validate(JSON_TYPES[type])).toThrow(
          TypeError,
          errorMessage
        );
      }
    });
  });
});
