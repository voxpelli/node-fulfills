'use strict';

const chai = require('chai');

const should = chai.should();

describe('Parser', function () {
  const compileCondition = require('../').compileCondition;

  it('should be able to parse a simple condition', () => {
    let condition;

    should.not.Throw(() => {
      condition = compileCondition('foo = bar');
    });

    condition.should.deep.equal({
      operator: '==',
      property: ['foo'],
      value: 'bar'
    });
  });
});
