'use strict'
/* eslint-disable no-undef */

const assert = require('assert')
const path = require('path')
const fileUtils = require('../../lib/util/file_utils')

describe('file utils', () => {
  describe('readAllFileRecursivelySync()', () => {
    it('should read recursively', () => {
      const files = fileUtils.readAllFileRecursivelySync(path.join(__dirname, './resources/app'))
      assert(files.includes('index.js'))
      assert(files.includes('README.md'))
      assert(files.includes('controller/home.js'))
    })
  })

  describe('isTemplate()', () => {
    it('is template', () => {
      assert(fileUtils.isTemplate('foo.tmpl.js'))
      assert(fileUtils.isTemplate('foo.tmpl'))
      assert(fileUtils.isTemplate('.tmpl.gitignore'))
      assert(fileUtils.isTemplate('app/foo.tmpl.js'))
      assert(fileUtils.isTemplate('app/foo.tmpl'))
      assert(fileUtils.isTemplate('foo.tmpl_foo.js'))
    })

    it('is not template', () => {
      assert(!fileUtils.isTemplate('foo.js'))
      assert(!fileUtils.isTemplate('foo'))
      assert(!fileUtils.isTemplate('footmpl'))
      assert(!fileUtils.isTemplate('foo.tmpl.'))
      assert(!fileUtils.isTemplate('foo.tmpl1'))
      assert(!fileUtils.isTemplate('foo.foo_tmpl.js'))
    })
  })

  describe('tmplToFileName()', () => {
    it('is template', () => {
      assert.strictEqual(fileUtils.tmplToFileName('foo.tmpl.js'), 'foo.js')
      assert.strictEqual(fileUtils.tmplToFileName('foo.tmpl'), 'foo')
      assert.strictEqual(fileUtils.tmplToFileName('app/foo.tmpl.js'), 'app/foo.js')
      assert.strictEqual(fileUtils.tmplToFileName('foo.tmpl_foo'), 'foo')
      assert.strictEqual(fileUtils.tmplToFileName('foo.tmpl_foo.js'), 'foo.js')
      assert.strictEqual(fileUtils.tmplToFileName('.tmpl.foo'), 'foo')
      assert.strictEqual(fileUtils.tmplToFileName('if_cond.foo.tmpl.js'), 'foo.js')
    })

    it('is not template', () => {
      assert.strictEqual(fileUtils.tmplToFileName('foo.js'), 'foo.js')
      assert.strictEqual(fileUtils.tmplToFileName('foo'), 'foo')
      assert.strictEqual(fileUtils.tmplToFileName('app/foo.js'), 'app/foo.js')
    })
  })

  describe('extractTmplType()', () => {
    it('should right type', () => {
      assert(fileUtils.extractTmplType('foo.tmpl.js') === 'default');
      assert(fileUtils.extractTmplType('foo.tmpl_default.js') === 'default');
      assert(fileUtils.extractTmplType('foo.tmpl_foo.js') === 'foo');
      assert(fileUtils.extractTmplType('foo.tmpl_foo_bar.js') === 'foo_bar');
    });
  });

  describe('extractConditions()', () => {
    it('should extract single condition', () => {
      assert(fileUtils.extractConditions('if_cond.foo.tmpl.js')[0] === 'cond');
    });

    it('should extract multi condition', () => {
      assert(fileUtils.extractConditions('if_cond1_cond2.foo.tmpl.js')[0] === 'cond1');
      assert(fileUtils.extractConditions('if_cond1_cond2.foo.tmpl.js')[1] === 'cond2');
    });

    it('should ignore empty condition', () => {
      assert.strictEqual(fileUtils.extractConditions('if_cond1__.foo.tmpl.js').length, 1);
      assert(fileUtils.extractConditions('if_cond1__.foo.tmpl.js')[0] === 'cond1');
    });

    it('should support condition with \'-\'', () => {
      assert(fileUtils.extractConditions('if_cond-1.foo.tmpl.js')[0] === 'cond-1');
    });
  });
})
