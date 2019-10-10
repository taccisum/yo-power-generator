/* eslint-disable no-undef */
'use strict'

const assert = require('assert');

const NoAnyAnswerTrigger = require('../../lib/trigger/no_any_answer_trigger');

describe('trigger/no_any_answer_trigger.test.js', () => {
  describe('isTrigger()', () => {
    it('should trigger on answers not match', () => {
      const trigger = new NoAnyAnswerTrigger('db', 'mysql');
      assert.strictEqual(trigger.isTrigger({
        db: 'oracle'
      }), true);
    });
    it('should trigger on answers not match any one', () => {
      const trigger = new NoAnyAnswerTrigger('db', 'mysql', 'mongo');
      assert.strictEqual(trigger.isTrigger({
        db: 'oracle'
      }), true);
    });
    it('should not trigger on answers match any one', () => {
      const trigger = new NoAnyAnswerTrigger('db', 'mysql', 'mongo');
      assert.strictEqual(trigger.isTrigger({
        db: 'mysql'
      }), false);
      assert.strictEqual(trigger.isTrigger({
        db: 'mongo'
      }), false);
    });
    it('should not trigger on answer null', () => {
      const trigger = new NoAnyAnswerTrigger('db', 'mysql', 'mongo');
      assert.strictEqual(trigger.isTrigger(null), false);
      assert.strictEqual(trigger.isTrigger({}), false);
    });
  });
  describe('toForm()', () => {
    const trigger = new NoAnyAnswerTrigger('db', 'mysql', 'mongo');
    const form = trigger.toForm();
    assert.strictEqual(form.type, 'noAnyAnswerTrigger')
    assert.strictEqual(form.answer, 'db')
    assert.deepStrictEqual(form.value, ['mysql', 'mongo'])
  });
});
