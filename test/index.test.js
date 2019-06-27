/* eslint-disable no-undef */

const assert = require('assert');

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
});
