'use strict';

const queryParser = (function () {
  try {
    return require('./condition-parser');
  } catch (e) {
    return require('pegjs').buildParser(require('fs').readFileSync(require('path').join(__dirname, 'condition-parser.pegjs')));
  }
}());

const compileCondition = function (query) {
  return queryParser.parse(query);
};

const fulfills = function (obj, condition) {
  // TODO: Do magic
};

module.exports = fulfills;
module.exports.compileCondition = compileCondition;
