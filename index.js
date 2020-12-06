'use strict';

const queryParser = require('./condition-parser');

/** @typedef {import('./condition-parser').Condition} Condition */
/** @typedef {import('./condition-parser').ValueCondition} ValueCondition */
/** @typedef {import('./condition-parser').DuoCondition} DuoCondition */

/** @typedef {Record<string,any>} FulfillsInput */

/**
 * @param {string} query
 * @returns {Condition}
 */
const compileCondition = function (query) {
  return queryParser.parse(query);
};

/**
 * @param {any} value
 * @param {ValueCondition} condition
 * @returns {boolean}
 */
const matchValueAgainstCondition = function (value, condition) {
  if (condition.operator === undefined && condition.value === undefined) {
    return !!value;
  }

  switch (condition.operator) {
    case '===':
      return value === condition.value;
    case '!==':
      return value !== condition.value;
    case '<':
      return value < condition.value;
    case '>':
      return value > condition.value;
    case '<=':
      return value <= condition.value;
    case '>=':
      return value >= condition.value;
    case '==':
      // eslint-disable-next-line eqeqeq
      return value == condition.value;
    case '!=':
      // eslint-disable-next-line eqeqeq
      return value != condition.value;
    default:
      throw new Error('Unknown operator "' + condition.operator + '"');
  }
};

/**
 * @param {any} obj
 * @param {import('./condition-parser').Property|undefined} remainingProperty
 * @param {ValueCondition} condition
 * @returns {boolean}
 */
const matchIndividualCondition = function (obj, remainingProperty, condition) {
  if (obj === undefined || obj === null || !remainingProperty || !remainingProperty.length) {
    return matchValueAgainstCondition(obj, condition);
  }

  const [key, ...nextInPropertyChain] = remainingProperty;

  if (typeof key === 'string') {
    return matchIndividualCondition(obj[key], nextInPropertyChain, condition);
  }

  // To support eg. arrays, we need some more complex types
  if (typeof key === 'object') {
    if (key.type === 'array') {
      if (!Array.isArray(obj)) return false;
      return obj.some(item => matchIndividualCondition(item, key.property, condition));
    }
    throw new Error('Unimplemented key type');
  }

  throw new TypeError('Unknown key type');
};

/**
 * @param {FulfillsInput} obj
 * @param {DuoCondition} condition
 * @returns {boolean}
 */
const matchDuoCondition = function (obj, condition) {
  if (matchCondition(obj, condition.left)) {
    if (condition.operator === 'AND') {
      return matchCondition(obj, condition.right);
    } else if (condition.operator === 'OR') {
      return true;
    } else {
      throw new Error('Unknown operator "' + condition.operator + '"');
    }
  } else if (condition.operator === 'AND') {
    return false;
  } else if (condition.operator === 'OR') {
    return matchCondition(obj, condition.right);
  } else {
    throw new Error('Unknown operator "' + condition.operator + '"');
  }
};

/**
 * @param {FulfillsInput} obj
 * @param {Condition} condition
 * @returns {boolean}
 */
const matchCondition = function (obj, condition) {
  if (condition.property !== undefined) {
    return matchIndividualCondition(obj, condition.property, condition);
  }

  if (!condition.operator && condition.not) {
    return !matchCondition(obj, condition.not);
  }

  if (condition.operator && condition.left && condition.right) {
    return matchDuoCondition(obj, condition);
  }

  throw new Error('Unimplemented condition structure');
};

/**
 * @param {FulfillsInput} obj
 * @param {string|Condition} condition
 * @returns {boolean}
 */
const fulfills = function (obj, condition) {
  if (typeof condition === 'string') {
    condition = compileCondition(condition);
  }
  return matchCondition(obj, condition);
};

module.exports = fulfills;
module.exports.compileCondition = compileCondition;
