/* eslint-disable no-undef */
'use strict'

const assert = require('assert');

const AbstractTemplateHandler = require('../lib/abstract_template_handler');

describe('lib/abstract_template_handler.test.js', () => {
  describe('_ignore()', () => {
    it('should ignore on condition is boolean false', () => {
      const handler = new AbstractTemplateHandler('if_cond.tmpl.js', undefined, { cond: false })
      assert(handler._ignore() === true);
    });

    it('should ignore on condition is undefined', () => {
      const handler = new AbstractTemplateHandler('if_cond.tmpl.js', undefined, {})
      assert(handler._ignore() === true);
    });

    it('should not ignore on condition is boolean true', () => {
      const handler = new AbstractTemplateHandler('if_cond.tmpl.js', undefined, { cond: true })
      assert(handler._ignore() === false);
    });

    it('should not ignore on condition is defined', () => {
      const handler = new AbstractTemplateHandler('if_cond.tmpl.js', undefined, { cond: {} })
      assert(handler._ignore() === false);
    });
  });
});
