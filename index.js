'use strict';

const queryParser = require('./condition-parser');

const compileCondition = function (query) {
  return queryParser.parse(query);
};

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
      return value == condition.value; // eslint-disable-line
    case '!=':
      return value != condition.value; // eslint-disable-line
    default:
      throw new Error('Unknown operator "' + condition.operator + '"');
  }
};

const matchIndividualCondition = function (obj, remainingProperty, condition) {
  if (obj === undefined || obj === null || !remainingProperty || !remainingProperty.length) {
    return matchValueAgainstCondition(obj, condition);
  }

  remainingProperty = [].concat(remainingProperty);

  const key = remainingProperty.shift();

  if (typeof key === 'object') {
    if (!key.array) {
      throw new Error('Unimplemented key type');
    }
    if (!Array.isArray(obj)) {
      return false;
    }
    return obj.some(item => matchIndividualCondition(item, key.property, condition));
  } else if (typeof key !== 'string') {
    throw new Error('Unknown key type');
  }

  return matchIndividualCondition(obj[key], remainingProperty, condition);
};

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

const matchCondition = function (obj, condition) {
  if (condition.property) {
    return matchIndividualCondition(obj, condition.property, condition);
  }

  if (condition.left && condition.right) {
    return matchDuoCondition(obj, condition);
  }

  if (condition.not) {
    return !matchCondition(obj, condition.not);
  }

  throw new Error('Unimplemented condition structure');
};

const fulfills = function (obj, condition) {
  if (typeof condition === 'string') {
    condition = compileCondition(condition);
  }
  return matchCondition(obj, condition);
};

module.exports = fulfills;
module.exports.compileCondition = compileCondition;
