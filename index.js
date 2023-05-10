'use strict';

const queryParser = require('./condition-parser');

/** @typedef {import('./condition-parser').Condition} Condition */
/** @typedef {import('./condition-parser').TruthyCondition} TruthyCondition */
/** @typedef {import('./condition-parser').NumericValueCondition} NumericValueCondition */
/** @typedef {import('./condition-parser').ValueCondition} ValueCondition */
/** @typedef {import('./condition-parser').DuoCondition} DuoCondition */

/** @typedef {undefined|boolean|null|number|string|{ [Key in string]?: FulfillsInputValue }} FulfillsInputValueRaw */
/** @typedef {FulfillsInputValueRaw|FulfillsInputValueRaw[]} FulfillsInputValue */
/** @typedef {{ [Key in string]?: FulfillsInputValue }} FulfillsInput */

/**
 * @param {string} query
 * @returns {Condition}
 */
const compileCondition = function (query) {
  return queryParser.parse(query);
};

/**
 * @param {number} value
 * @param {NumericValueCondition} condition
 * @returns {boolean}
 */
const matchNumericValueAgainstCondition = function (value, condition) {
  const {
    operator,
    value: conditionValue,
  } = condition;

  if (typeof conditionValue !== 'number') {
    throw new TypeError(`Expected a numeric condition value for operator "${operator}", instead got: ${typeof conditionValue}`);
  }

  switch (operator) {
    case '<':
      return value < conditionValue;
    case '>':
      return value > conditionValue;
    case '<=':
      return value <= conditionValue;
    case '>=':
      return value >= conditionValue;
    default:
      throw new Error(`Unknown operator "${operator}"`);
  }
};

/**
 * @param {FulfillsInputValue} value
 * @param {TruthyCondition|ValueCondition} condition
 * @returns {boolean}
 */
const matchValueAgainstCondition = function (value, condition) {
  const {
    operator,
    value: conditionValue,
  } = condition;

  if (operator === undefined && conditionValue === undefined) {
    return !!value;
  }

  if (typeof operator !== 'string') {
    throw new TypeError(`Expected a string operator, instead got: ${operator}`);
  }

  switch (operator) {
    case '===':
      return value === conditionValue;
    case '!==':
      return value !== conditionValue;
    case '==':
      // eslint-disable-next-line eqeqeq
      return value == conditionValue;
    case '!=':
      // eslint-disable-next-line eqeqeq
      return value != conditionValue;
    case '<':
    case '>':
    case '<=':
    case '>=':
      if (typeof value !== 'number') {
        throw new TypeError(`Expected a numeric value to for use with operator "${operator}", instead got: ${typeof value}`);
      }
      return matchNumericValueAgainstCondition(value, condition);
    default:
      throw new Error(`Unknown operator "${operator}"`);
  }
};

/**
 * @param {FulfillsInputValue} obj
 * @param {import('./condition-parser').Property|undefined} remainingProperty
 * @param {TruthyCondition|ValueCondition} condition
 * @returns {boolean}
 */
const matchIndividualCondition = function (obj, remainingProperty, condition) {
  if (obj === undefined || obj === null || !remainingProperty || !remainingProperty.length) {
    return matchValueAgainstCondition(obj, condition);
  }

  const [key, ...nextInPropertyChain] = remainingProperty;

  if (typeof key === 'string') {
    /** @type {FulfillsInputValue} */
    let objValueByKey;

    if (Array.isArray(obj) || typeof obj === 'string') {
      if (key === 'length') {
        objValueByKey = obj[key];
      }
    } else if (typeof obj === 'object') {
      objValueByKey = obj[key];
    }

    return matchIndividualCondition(objValueByKey, nextInPropertyChain, condition);
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
 * @param {FulfillsInputValue} obj
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
      throw new Error(`Unknown operator "${condition.operator}"`);
    }
  } else if (condition.operator === 'AND') {
    return false;
  } else if (condition.operator === 'OR') {
    return matchCondition(obj, condition.right);
  } else {
    throw new Error(`Unknown operator "${condition.operator}"`);
  }
};

/**
 * @param {FulfillsInputValue} obj
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
