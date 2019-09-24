/* eslint-disable no-undef */

const assert = require('assert');
const yoassert = require('yeoman-assert')
const helpers = require('yeoman-test')
const path = require('path');

describe('index.test.js', () => {
  it('should pass on require', () => {
    require('../index');
    assert(require('../index').getGenerator);
    assert(require('../index').AbstractTemplateHandler);
  });

  it('should pass on new Generator', () => {
    const getGenerator = require('../index').getGenerator;
    assert(getGenerator())
  });

  describe('simple generator', () => {
    it('should generate files', () => {
      return helpers
        .run(path.join(__dirname, './apps/simple'))
        .then(() => {
          yoassert.file('1.js')
          yoassert.file('2.js')
          yoassert.noFile('3.js')
        })
    });
  });

  describe('complex generator', () => {
  });

  describe('common options', () => {
    it('should output generator description on option --desc', () => {
      return helpers
        .run(path.join(__dirname, './apps/simple'))
        .withOptions({
          '--desc': '1'
        })
        .then(() => {
          assert.noFile('1.js')
        })
    });

    it('should output form description on option -', () => {
      return helpers
        .run(path.join(__dirname, './apps/simple'))
        .withOptions({
          '-f': '1'
        })
        .then(() => {
          assert.noFile('1.js')
        })
    });
  });
});
