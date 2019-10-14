/* eslint-disable no-undef */
'use strict'

const assert = require('assert');

const AnyAnswerTrigger = require('../../lib/trigger/any_answer_trigger');

describe('trigger/any_answer_trigger.js', () => {
  it('isTrigger result should is true', () => {
    const trigger = new AnyAnswerTrigger('db', 'mysql', 'mongo');
    assert(trigger.isTrigger({ db: 'mysql' }) === true);
  });

  it('toForm result should is right', () => {
    const trigger = new AnyAnswerTrigger('db', 'mysql', 'mongo');
    const form = trigger.toForm();
    assert.strictEqual(form.type, 'anyAnswerTrigger');
    assert.strictEqual(form.answer, 'db');
    assert.deepStrictEqual(form.value, ['mysql', 'mongo']);
  });
});
