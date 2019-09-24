/* eslint-disable no-undef */
'use strict'

const assert = require('assert');
const AbstractTrigger = require('../lib/abstract_trigger');

describe('lib/abstract_trigger.test.js', () => {
  describe('isTrigger', () => {
    it('should throw exception', () => {
      assert.throws(() => {
        new AbstractTrigger().isTrigger();
      }, new Error('not implement'));
    });
  });

  describe('toForm', () => {
    it('should throw exception', () => {
      assert.throws(() => {
        new AbstractTrigger().toForm();
      }, new Error('not implement'));
    });
  });
});
