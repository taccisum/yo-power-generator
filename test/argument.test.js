/* eslint-disable no-undef */
'use strict'
const builder = require('../lib/argument').builder;
const assert = require('assert');
const AnswerTrigger = require('../lib/trigger/any_answer_trigger');

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

  describe('toForm', () => {
    const arg = builder({
      groupId: {
        prompting: { type: 'input', message: '请输入你的group id', default: 'com.deepexi' },
        option: { desc: 'group id', type: String }
      },
      discovery: {
        prompting: { type: 'list', choices: ['zookeeper', 'nacos'], message: '请选择你使用的注册中心' },
        option: { desc: '注册中心', type: String, default: 'zookeeper' }
      },
      jwt: {
        prompting: { type: 'list', choices: [{key: 'jwt', display: '无状态jwt'}, 'session', {key: 'none', display: '无'}], message: '请选择你采用的认证机制类型'},
        option: { desc: "认证机制", type: String, default: 'jwt'}
      },
      db: {
        prompting: {
          type: 'list',
          choices: ['mysql', 'none'],
          message: '请选择你使用的数据库'
        },
        option: { desc: '数据库', type: String, default: 'none' },
        child: {
          dbPool: {
            prompting: { type: 'list', choices: ['druid', 'default'], message: '请选择你使用的数据库连接池' },
            option: { desc: '数据库连接池', type: String, default: 'none' },
            callbacks: {
              trigger: [
                new AnswerTrigger('db', 'mysql')
              ]
            }
          }
        }
      }
    })
    const form = arg.toForm();

    assert(form)
    assert.strictEqual(form.groupId.default, 'com.deepexi')
    assert.strictEqual(form.discovery.default, 'zookeeper')
    assert.strictEqual(form.db.default, 'none')
    assert.strictEqual(form.db.child.dbPool.trigger[0].type, 'anyAnswerTrigger')
    assert.strictEqual(form.jwt.default, 'jwt')
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
              prompting: { type: 'list', choices: [{key: 'jwt', display: '无状态jwt'}, 'session', {key: 'none', display: '无'}], msg: 'l1'},
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
            async prompt (prompting) {
              return {
                [prompting.name]: prompting.msg
              }
            }
          })
        const ls = await arg.prompt();
        assert(ls.l2 === 'l2');
        assert(ls.l3 === 'l3');
        assert(ls.l3_1 === 'l3_1');
      });
    });

    it('should output prompt message hierarchically', async () => {
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
            prompting: { message: 'l1' },
            child: {
              l2: {
                prompting: { message: 'l2' },
                child: {
                  l3: { prompting: { message: 'l3' } },
                  l3_1: { prompting: { message: 'l3_1' } }
                }
              }
            }
          }
        }, {
          async prompt (prompting) {
            return {
              [prompting.name]: prompting.message
            }
          }
        })
      const ls = await arg.prompt();
      console.log(ls);
      assert.strictEqual(ls.l1, 'l1');
      assert.strictEqual(ls.l2, ' > l2');
      assert.strictEqual(ls.l3, '  > l3');
      assert.strictEqual(ls.l3_1, '  > l3_1');
    });

    it('trigger', async () => {
      const arg = builder({
        l1: {
          prompting: { msg: 'l1' },
          child: {
            l2: {
              prompting: { msg: 'l2' },
              callbacks: {
                trigger (answers) {
                  return answers.l1 === 'other';
                }
              }
            },
            l3: {
              prompting: { msg: 'l3' },
              callbacks: {
                trigger: [
                  new AnswerTrigger('l1', 'other')
                ]
              }
            }
          }
        }
      }, {
        async prompt (prompting) {
          return {
            [prompting.name]: prompting.msg
          }
        }
      })
      const ls = await arg.prompt();
      console.log(ls);
      assert(ls.l1 === 'l1');
      assert(ls.l2 === undefined);
      assert(ls.l3 === undefined);
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
