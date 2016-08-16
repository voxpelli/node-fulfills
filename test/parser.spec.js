'use strict';

const chai = require('chai');

chai.should();

describe('Parser', function () {
  const compileCondition = require('../').compileCondition;

  it('should be able to parse a simple condition', () => {
    const condition = 'foo = bar';
    compileCondition(condition).should.deep.equal({
      operator: '==',
      property: ['foo'],
      value: 'bar'
    });
  });

  it('should be able to parse a complex condition', () => {
    const condition = '!(bookmark.bar-car.foo["abc adf sdaf sda f"][][][]=123) AND foo OR bar=abc OR foo="\\\\" OR foo[]=123 OR foo.abc[].bar.foo[] != true';
    compileCondition(condition).should.deep.equal({
      left: {
        left: {
          not: {
            property: [
              'bookmark',
              'bar-car',
              'foo',
              'abc adf sdaf sda f',
              {
                array: true,
                property: [{
                  array: true,
                  property: [{
                    array: true
                  }]
                }]
              }
            ],
            operator: '==',
            value: 123
          }
        },
        operator: 'AND',
        right: {
          property: [
            'foo'
          ]
        }
      },
      operator: 'OR',
      right: {
        left: {
          property: [
            'bar'
          ],
          operator: '==',
          value: 'abc'
        },
        operator: 'OR',
        right: {
          left: {
            property: [
              'foo'
            ],
            operator: '==',
            value: '\\'
          },
          operator: 'OR',
          right: {
            left: {
              property: [
                'foo',
                {
                  array: true
                }
              ],
              operator: '==',
              value: 123
            },
            operator: 'OR',
            right: {
              property: [
                'foo',
                'abc',
                {
                  array: true,
                  property: [
                    'bar',
                    'foo',
                    {
                      array: true
                    }
                  ]
                }
              ],
              operator: '!=',
              value: true
            }
          }
        }
      }
    });
  });
});
