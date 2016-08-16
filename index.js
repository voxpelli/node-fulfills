'use strict';

const queryParser = require('./condition-parser');

const compileCondition = function (query) {
  return queryParser.parse(query);
};

const matchCondition = function () {
  // TODO: Match the condition against the object
};

const fulfills = function (obj, condition) {
  if (typeof condition === 'string') {
    condition = compileCondition(condition);
  }
  return matchCondition(obj, condition);
};

module.exports = fulfills;
module.exports.compileCondition = compileCondition;
