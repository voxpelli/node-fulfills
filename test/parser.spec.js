'use strict';

const chai = require('chai');

chai.should();

describe('Parser', function () {
  const compileCondition = require('../').compileCondition;
  const complex = require('./complex');

  it('should be able to parse a simple condition', () => {
    const condition = 'foo = bar';
    compileCondition(condition).should.deep.equal({
      operator: '==',
      property: ['foo'],
      value: 'bar'
    });
  });

  it('should be able to parse a complex condition', () => {
    compileCondition(complex.condition).should.deep.equal(complex.parsedCondition);
  });
});
