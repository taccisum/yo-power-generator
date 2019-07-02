/* eslint-disable no-undef */
'use strict'
const builder = require('../lib/argument').builder;
const assert = require('assert');

describe('lib/argument.test.js', () => {
  describe('builder', () => {
    /**
     *    l1
     *     |
     *    l2
     *   /   \
     *  l3  l3_1
     */
    const arg = builder({
      l1: {
        child: {
          l2: {
            child: {
              l3: {
              },
              l3_1: {
              }
            }
          }
        }
      }
    })

    assert(arg)
    assert.strictEqual(arg.children[0].name, 'l1')
    assert.strictEqual(arg.children[0].children[0].name, 'l2')
    assert.strictEqual(arg.children[0].children[0].children[0].name, 'l3')
    assert.strictEqual(arg.children[0].children[0].children[1].name, 'l3_1')
  });

  describe('Argument', () => {
    describe('prompt', () => {
      it('should prompt recusively', async () => {
        const arg = builder(
          /**
           *    l1
           *     |
           *    l2
           *   /   \
           *  l3  l3_1
           */
          {
            l1: {
              prompting: { msg: 'l1' },
              child: {
                l2: {
                  prompting: { msg: 'l2' },
                  child: {
                    l3: { prompting: { msg: 'l3' } },
                    l3_1: { prompting: { msg: 'l3_1' } }
                  }
                }
              }
            }
          }, {
            prompt (prompting) {
              return {
                [prompting.name]: prompting.msg
              }
            }
          })
        const ls = await arg.prompt();
        assert(ls.l1 === 'l1');
        assert(ls.l2 === 'l2');
        assert(ls.l3 === 'l3');
        assert(ls.l3_1 === 'l3_1');
      });
    });

    describe('options', () => {
      it('should collect option recursively', () => {
        /**
         *    l1
         *     |
         *    l2
         *   /   \
         *  l3  l3_1
         */
        const arg = builder({
          l1: {
            option: {},
            child: {
              l2: {
                option: {},
                child: {
                  l3: { option: {} },
                  l3_1: { option: {} }
                }
              }
            }
          }
        })
        const options = arg.options();
        assert.strictEqual(options.length, 4);
        assert.strictEqual(options[0].key, 'l1');
        assert.strictEqual(options[1].key, 'l2');
        assert.strictEqual(options[2].key, 'l3');
        assert.strictEqual(options[3].key, 'l3_1');
      });
    });
  });
});
