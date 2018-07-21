## JSON Cyclic 

[![CircleCI](https://circleci.com/gh/thegreatercurve/json-cyclic.svg?style=svg)](https://circleci.com/gh/thegreatercurve/json-cyclic)

A small JavaScript library to replace circular references in object literals with [JSONPath](http://goessner.net/articles/JsonPath/) references, so that the data can be stringified as JSON.

It also supports re-inserting the circular data after the JSON has been parsed.

This will fix the below TypeErrors:

```
Chrome: "TypeError: Converting circular structure to JSON"
Firefox: "TypeError: cyclic object value"
Edge: "TypeError: Circular reference in value argument not supported"
Safari: "TypeError: JSON.stringify cannot serialize cyclic structures."
```

## Features
 - Accepts Arrays, Objects, or both in combination
 - Works with >IE8
 - Tiny (~1kB minified)
 - No dependencies

## Installation

```
npm install json-cyclic
```

## Usage

```js
// ES2015
import { encycle, decycle } from "json-cyclic"

// CommonJS
const JSONCyclic = require("json-cyclic") 
```

## API

There are only two methods exposed, and neither require any configuration: 

### `decycle`
Removes any circular data structures. 

See the below usage examples: 

```js
// Arrays
const arr= [1, "a"]

arr[2] = arr;

JSON.stringify(decycle(arr)); // "{"foo":{"bar":{"$ref":"$.foo"}}}"

// Objects
const obj = { foo: { bar: null } };

obj.foo.bar = obj.foo;

JSON.stringify(decycle(obj)); // "{"foo":{"bar":{"$ref":"$.foo"}}}"
```

### `encycle`

Re-inserts any circular data.

See the below: 

```js
const arr = [1, "a", { $ref: "$" }]

encycle(arr)

console.log(arr[2] === arr) // true

JSON.stringify(encycle(arr)); // TypeError: Converting circular structure to JSON
```

## Tests

```
npm test
```
