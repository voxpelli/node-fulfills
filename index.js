'use strict';

const queryParser = require('./condition-parser');

const compileCondition = function (query) {
  return queryParser.parse(query);
};

const matchValueAgainstCondition = function (value, condition) {
  if (condition.operator === '==') {
    return value == condition.value; // eslint-disable-line
  } else if (condition.operator === '!=') {
    return value != condition.value; // eslint-disable-line
  } else {
    throw new Error('unimplemented operator "' + condition.operator + '"');
  }
};

const matchIndividualCondition = function (obj, remainingProperty, condition) {
  remainingProperty = [].concat(remainingProperty);

  const key = remainingProperty.shift();

  if (typeof key === 'object') {
    // TODO: It's probably an array – deal with it!
    throw new Error('Unimplemented key type');
  } else if (typeof key !== 'string') {
    throw new Error('Unknown key type');
  }

  if (obj[key] && remainingProperty.length) {
    return matchIndividualCondition(obj[key], remainingProperty, condition);
  }

  return matchValueAgainstCondition(obj[key], condition);
};

const matchCondition = function (obj, condition) {
  // TODO: Match the condition against the object
  if (condition.property) {
    return matchIndividualCondition(obj, condition.property, condition);
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
