'use strict';

const chai = require('chai');

chai.should();

describe('Fulfills', function () {
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

  describe('comparison operators', () => {
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

    it('should be able match against non-found values', () => {
      fulfills(testObject, {
        operator: '!=',
        property: ['nonexisting', 'def', 'ghi'],
        value: 'bar'
      }).should.be.ok;
    });
  });

  describe('logical operators', () => {
    it('should be able match an OR condition', () => {
      fulfills(testObject, {
        left: {
          operator: '===',
          property: ['foo'],
          value: 'error'
        },
        operator: 'OR',
        right: {
          operator: '===',
          property: ['foo'],
          value: 'bar'
        }
      }).should.be.ok;
    });

    it('should be able match an AND condition', () => {
      fulfills(testObject, {
        left: {
          operator: '===',
          property: ['foo'],
          value: 'bar'
        },
        operator: 'AND',
        right: {
          operator: '===',
          property: ['abc', 'def', 'ghi'],
          value: 'bar'
        }
      }).should.be.ok;

      fulfills(testObject, {
        left: {
          operator: '===',
          property: ['foo'],
          value: 'bar'
        },
        operator: 'AND',
        right: {
          operator: '===',
          property: ['foo'],
          value: 'error'
        }
      }).should.not.be.ok;
    });
  });
});
