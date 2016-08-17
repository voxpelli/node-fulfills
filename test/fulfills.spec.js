'use strict';

const chai = require('chai');

chai.should();

describe('Parser', function () {
  const fulfills = require('../');

  let testObject;

  before(() => {
    testObject = {
      foo: 'bar',
      num: 123,
      falsk: false,
      abc: { def: { ghi: 'bar' } }
    };
  });

  it('should be able match a simple condition', () => {
    fulfills(testObject, {
      operator: '===',
      property: ['foo'],
      value: 'bar'
    }).should.be.ok;
  });

  it('should be able match a deep condition', () => {
    fulfills(testObject, {
      operator: '===',
      property: ['abc', 'def', 'ghi'],
      value: 'bar'
    }).should.be.ok;
  });

  it('should be able match a "===" condition', () => {
    fulfills(testObject, { operator: '===', property: ['num'], value: 123 }).should.be.ok;
    fulfills(testObject, { operator: '===', property: ['num'], value: '123' }).should.not.be.ok;
  });

  it('should be able match a "!==" condition', () => {
    fulfills(testObject, { operator: '!==', property: ['num'], value: 123 }).should.not.be.ok;
    fulfills(testObject, { operator: '!==', property: ['num'], value: '123' }).should.be.ok;
  });

  it('should be able match a "==" condition', () => {
    fulfills(testObject, { operator: '==', property: ['num'], value: 123 }).should.be.ok;
    fulfills(testObject, { operator: '==', property: ['num'], value: '123' }).should.be.ok;
  });

  it('should be able match a "!=" condition', () => {
    fulfills(testObject, { operator: '!=', property: ['num'], value: 123 }).should.not.be.ok;
    fulfills(testObject, { operator: '!=', property: ['num'], value: '123' }).should.not.be.ok;
  });

  it('should be able match a "<" condition', () => {
    fulfills(testObject, { operator: '<', property: ['num'], value: 200 }).should.be.ok;
  });

  it('should be able match a ">" condition', () => {
    fulfills(testObject, { operator: '>', property: ['num'], value: 100 }).should.be.ok;
  });

  it('should be able match a "<=" condition', () => {
    fulfills(testObject, { operator: '<=', property: ['num'], value: 123 }).should.be.ok;
    fulfills(testObject, { operator: '<=', property: ['num'], value: 200 }).should.be.ok;
  });

  it('should be able match a ">=" condition', () => {
    fulfills(testObject, { operator: '>=', property: ['num'], value: 123 }).should.be.ok;
    fulfills(testObject, { operator: '>=', property: ['num'], value: 100 }).should.be.ok;
  });

  it('should handle an operator less condition', () => {
    fulfills(testObject, { property: ['foo'] }).should.be.ok;
    fulfills(testObject, { property: ['falsk'] }).should.not.be.ok;
  });
});
