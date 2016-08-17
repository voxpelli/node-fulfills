'use strict';

const chai = require('chai');

chai.should();

describe('Fulfills', function () {
  const fulfills = require('../');
  const complex = require('./complex');

  let testObject;

  before(() => {
    testObject = {
      foo: 'bar',
      num: 123,
      falsk: false,
      list: [
        'sak1',
        'sak2',
        'sak3'
      ],
      complex: [
        { xyz: ['bob1', 'bob2'] },
        { xyz: ['bob3', 'bob4', 'bob5'] }
      ],
      abc: { def: { ghi: 'bar' } }
    };
  });

  describe('basic value matching', () => {
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

  describe('array matching', () => {
    it('should be able match a value in an array', () => {
      fulfills(testObject, {
        operator: '===',
        property: ['list', { array: true }],
        value: 'sak1'
      }).should.be.ok;

      fulfills(testObject, {
        operator: '===',
        property: ['list', { array: true }],
        value: 'error'
      }).should.not.be.ok;
    });

    it('should not look inside array when not requested to', () => {
      fulfills(testObject, {
        operator: '===',
        property: ['list'],
        value: 'sak1'
      }).should.not.be.ok;
    });

    it('should be able to look into deep nested array structures', () => {
      fulfills(testObject, {
        operator: '===',
        property: [
          'complex',
          {
            array: true,
            property: [
              'xyz',
              { array: true }
            ]
          }
        ],
        value: 'bob4'
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

    it('should be able match a NOT condition', () => {
      fulfills(testObject, {
        not: {
          operator: '===',
          property: ['foo'],
          value: 'error'
        }
      }).should.be.ok;
    });
  });

  describe('complex', () => {
    it('should be able to handle the most complex example', () => {
      fulfills(testObject, complex.parsedCondition).should.be.ok;
    });
  });
});
