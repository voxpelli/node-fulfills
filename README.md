# Fulfills

[![Build Status](https://travis-ci.org/voxpelli/node-fulfills.svg?branch=master)](https://travis-ci.org/voxpelli/node-fulfills)
[![Coverage Status](https://coveralls.io/repos/voxpelli/node-fulfills/badge.svg)](https://coveralls.io/r/voxpelli/node-fulfills)
[![Dependency Status](https://gemnasium.com/voxpelli/node-fulfills.svg)](https://gemnasium.com/voxpelli/node-fulfills)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat)](https://github.com/Flet/semistandard)

Checks whether an object fulfills a specified condition

## Requirements

Requires at least Node.js 6.x

## Installation

```bash
npm installfulfills --save
```


## Usage

```javascript
const fulfills = require('fulfills');

const obj = {
  property: { subproperty: 'value' }
};

// Performant option – useful if the same condition is used over and over again
const condition = fulfills.compile('property.subproperty = value OR property.subproperty = 123');

if (fulfills(obj, condition)) {
  // ...
}

// Short option – useful if a condition will only be used once
if (fulfills(obj, 'property.subproperty = value OR property.subproperty = 123')) {
  // ...
}
```
