# Fulfills

[![Build Status](https://github.com/voxpelli/node-fulfills/workflows/Node%20CI/badge.svg)](https://launch-editor.github.com/actions?workflowID=Node%20CI&event=push&nwo=voxpelli%2Fnode-fulfills)
[![Coverage Status](https://coveralls.io/repos/voxpelli/node-fulfills/badge.svg)](https://coveralls.io/r/voxpelli/node-fulfills)
[![Known Vulnerabilities](https://snyk.io/test/github/voxpelli/node-fulfills/badge.svg?targetFile=package.json)](https://snyk.io/test/github/voxpelli/node-fulfills?targetFile=package.json)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat)](https://github.com/Flet/semistandard)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/voxpelli/node-fulfills.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/voxpelli/node-fulfills/context:javascript)

Checks whether or not an object fulfills a specified condition

## Requirements

Requires at least Node.js 10.x

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

The maintainers of connect-pg-simple and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source packages you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact packages you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-fulfills?utm_source=npm-fulfills&utm_medium=referral&utm_campaign=enterprise)

