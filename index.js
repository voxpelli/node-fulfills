'use strict';

const queryParser = require('./condition-parser');

const compileCondition = function (query) {
  return queryParser.parse(query);
};

const fulfills = function (obj, condition) {
  // TODO: Do magic
};

module.exports = fulfills;
module.exports.compileCondition = compileCondition;
