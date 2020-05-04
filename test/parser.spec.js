'use strict';

const chai = require('chai');

const should = chai.should();

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

  describe('comparison operators', () => {
    const verify = (operator, alias) => compileCondition(`foo ${alias || operator} bar`).should.deep.equal({
      operator,
      property: ['foo'],
      value: 'bar'
    });

    it('should be able to parse ===', () => { verify('==='); });
    it('should be able to parse ==', () => { verify('=='); });
    it('should be able to parse =', () => { verify('==', '='); });
    it('should be able to parse !==', () => { verify('!=='); });
    it('should be able to parse !=', () => { verify('!='); });
    it('should be able to parse <>', () => { verify('!=', '<>'); });
    it('should be able to parse >', () => { verify('>'); });
    it('should be able to parse <', () => { verify('<'); });
    it('should be able to parse >=', () => { verify('>='); });
    it('should be able to parse <=', () => { verify('<='); });
  });

  describe('logical operators', () => {
    const verify = (operator, alias) => compileCondition(`foo ${alias || operator} bar`).should.deep.equal({
      operator,
      left: { property: ['foo'] },
      right: { property: ['bar'] }
    });

    const verifyNegation = (operator, alias) => compileCondition(`${alias || operator} foo`).should.deep.equal({
      not: { property: ['foo'] }
    });

    it('should be able to parse "AND"', () => { verify('AND'); });
    it('should be able to parse "and"', () => { verify('AND', 'and'); });
    it('should be able to parse "&&"', () => { verify('AND', '&&'); });

    it('should be able to parse "OR"', () => { verify('OR'); });
    it('should be able to parse "or"', () => { verify('OR', 'or'); });
    it('should be able to parse "||"', () => { verify('OR', '||'); });

    it('should be able to parse "NOT"', () => { verifyNegation('NOT'); });
    it('should be able to parse "not"', () => { verifyNegation('NOT', 'not'); });
    it('should be able to parse "!"', () => { verifyNegation('NOT', '!'); });
  });

  describe('property names', () => {
    it('should be able to parse properties in all cases', () => {
      const condition = 'fooBar = bar';
      compileCondition(condition).should.deep.equal({
        operator: '==',
        property: ['fooBar'],
        value: 'bar'
      });
    });

    it('should permit certain non-alpha characters', () => {
      const condition = 'foo-bar_abc = bar';
      compileCondition(condition).should.deep.equal({
        operator: '==',
        property: ['foo-bar_abc'],
        value: 'bar'
      });
    });

    it('should handle numbers in property names', () => {
      const condition = 'foo123 = bar';
      compileCondition(condition).should.deep.equal({
        operator: '==',
        property: ['foo123'],
        value: 'bar'
      });
    });

    it('should handle single char property names', () => {
      const condition = 'f = bar';
      compileCondition(condition).should.deep.equal({
        operator: '==',
        property: ['f'],
        value: 'bar'
      });
    });

    it('should not allow a non alpha characters in beginning of property name', () => {
      should.Throw(function numeric () { compileCondition('123foo = bar'); }, /^Expected/);
      should.Throw(function dash () { compileCondition('-foo = bar'); }, /^Expected/);
      should.Throw(function underscore () { compileCondition('_foo = bar'); }, /^Expected/);
    });
  });
});
