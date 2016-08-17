'use strict';

const chai = require('chai');

chai.should();

describe('Parser', function () {
  const fulfills = require('../');

  let testObject;

  before(() => {
    testObject = {
      foo: 'bar',
      abc: { def: { ghi: 'bar' } }
    };
  });

  it('should be able match a simple condition', () => {
    fulfills(testObject, {
      operator: '==',
      property: ['foo'],
      value: 'bar'
    }).should.be.ok;
  });

  it('should be able match a deep condition', () => {
    fulfills(testObject, {
      operator: '==',
      property: ['abc', 'def', 'ghi'],
      value: 'bar'
    }).should.be.ok;
  });

  it('should be able match a "!=" condition', () => {
    fulfills(testObject, {
      operator: '!=',
      property: ['foo'],
      value: 'abc'
    }).should.be.ok;
  });
});
