/* eslint-disable no-undef */
'use strict'

const assert = require('assert');

const AnswerTrigger = require('../lib/trigger/answer_trigger');

describe('lib/trigger', () => {
  describe('answer_trigger.js', () => {
    it('isTrigger result should is true', () => {
      const trigger = new AnswerTrigger('db', 'mysql', 'mongo');
      assert(trigger.isTrigger({ db: 'mysql' }) === true);
    });

    it('toForm result should is right', () => {
      const trigger = new AnswerTrigger('db', 'mysql', 'mongo');
      const form = trigger.toForm();
      assert.strictEqual(form.type, 'answerTrigger');
    });
  });
});
