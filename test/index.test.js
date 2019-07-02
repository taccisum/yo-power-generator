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
    before(() => {
      return helpers
        .run(path.join(__dirname, './app'))
        .withPrompts({
          groupId: 'com.deepexi'
        })
        .then(() => {
        })
    });

    it('should exists file', () => {
      yoassert.file('1.js')
    });
  });
});
