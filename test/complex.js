'use strict';

const condition = '!(bookmark.bar-car.foo["abc adf sdaf sda f"][][][]=123) AND foo OR bar=abc OR foo="\\\\" OR foo[]=123 OR foo.abc[].bar.foo[] != true';
/** @type {import('..').Condition} */
const parsedCondition = {
  left: {
    left: {
      not: {
        property: [
          'bookmark',
          'bar-car',
          'foo',
          'abc adf sdaf sda f',
          {
            type: 'array',
            property: [{
              type: 'array',
              property: [{
                type: 'array'
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
              type: 'array'
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
              type: 'array',
              property: [
                'bar',
                'foo',
                {
                  type: 'array'
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
};

module.exports = {
  condition,
  parsedCondition
};
