# Yo Power Generator

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![Build Status](https://www.travis-ci.org/deepexi/yo-power-generator.svg?branch=master)](https://www.travis-ci.org/deepexi/yo-power-generator)
[![codecov](https://codecov.io/gh/deepexi/yo-power-generator/branch/master/graph/badge.svg)](https://codecov.io/gh/deepexi/yo-power-generator)

[npm-image]: https://img.shields.io/npm/v/yo-power-generator.svg
[npm-url]: https://www.npmjs.com/package/yo-power-generator
[download-image]: https://img.shields.io/npm/dm/yo-power-generator.svg
[download-url]: https://www.npmjs.com/package/yo-power-generator

a power generator implementation of yeoman.

## How To

### Getting Started

```js
// generators/app/index.js
'use strict'

const path = require('path');

const obj = {
  orgName: {
    prompting: {
      type: 'input',
      message: 'your org name(optional)'
    },
    option: { desc: '组织名称', type: String, default: '' }
  }
}
module.exports = require('yo-power-generator').getGenerator(obj, {
  handlerDir: path.join(__dirname, 'handler'),
  templateDir: path.join(__dirname, 'templates')
});
```
