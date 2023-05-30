<div align="center">
  <img
    src="fulfills.svg"
    width="650"
    height="auto"
  />
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/fulfills.svg?style=flat)](https://www.npmjs.com/package/fulfills)
[![npm downloads](https://img.shields.io/npm/dm/fulfills.svg?style=flat)](https://www.npmjs.com/package/fulfills)
[![Module type: CJS](https://img.shields.io/badge/module%20type-cjs-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![Types in JS](https://img.shields.io/badge/types_in_js-yes-brightgreen)](https://github.com/voxpelli/types-in-js)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/voxpelli/eslint-config)
[![Follow @voxpelli@mastodon.social](https://img.shields.io/mastodon/follow/109247025527949675?domain=https%3A%2F%2Fmastodon.social&style=social)](https://mastodon.social/@voxpelli)

</div>

Checks whether or not an object fulfills a specified condition

## Installation

```bash
npm install fulfills --save
```

## Usage

```javascript
const fulfills = require('fulfills');

const obj = {
  property: { subproperty: 'value' }
};

// Performant option – useful if the same condition is used over and over again
const condition = fulfills.compileCondition('property.subproperty = value OR property.subproperty = 123');

if (fulfills(obj, condition)) {
  // ...
}

// Short option – useful if a condition will only be used once
if (fulfills(obj, 'property.subproperty = value OR property.subproperty = 123')) {
  // ...
}
```

## Condition syntax

A condition has the syntax of:

`property == value` or just `property`

The `==` can be any supported comparison operator. If only a property is given then the condition will be true of the property contains a truthy value in the javascript sense.

Multiple conditions can be combined or modified through the use of logical operators and when doing so parantheses can be used to group them together into different groups.

### Needlessly complex example

`!(bookmark.bar-car.foo["abc adf sdaf sda f"][][][]=123) AND foo OR bar=abc OR foo="\\" OR foo[]=123 OR foo.abc[].bar.foo[] != true`

### Property syntax

The property can be targeted at subproperties by appending them with a `.` before each level, like: `property.subproperty.subpropertyOfSubproperty`.

To look for a value in an array rather than compare the value to the array itself, then append `[]` to the property like: `property[]`

The array syntax and subproperties can be combined however one likes. For example: `property.subproperty[][].propertyOfObjectInATwoLevelDeepArray`

Complex property names can be specified like `["very complex property name"]`. Values in such property names can be escaped, like: `["property name including a \"funny\" char"]`

### Supported values

* *Simple strings* – a single word containing just a-z needs no quotes. Example: `foobar`
* *Quoted stringes* – multiple words or complex words needs to be quoted. Example: `"a very long text"`. Supports escaping, like: `"This is an escaped \" character"`
* *Integers* – a number containg just `0-9` chars
* *Booleans* – when set to exactly `true` or `false`

### Comparison operators

All work just like the javascript comparison operators does.

* `===`
* `==` (alias: `=`)
* `!==`
* `!=` (alias: `<>`)
* `<`
* `>`
* `<=`
* `>=`

### Logical operators

* `OR` (alias: `||`)
* `AND` (alias: `&&`)
* `NOT` (alias: `!`)

## For enterprise

Available as part of the Tidelift Subscription.

The maintainers of fulfills and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source packages you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact packages you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-fulfills?utm_source=npm-fulfills&utm_medium=referral&utm_campaign=enterprise)

