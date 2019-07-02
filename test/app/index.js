'use strict'
const path = require('path');

const obj = {
  cond: {
    prompting: { type: 'confirm', message: 'cond', default: true }
  }
}

module.exports = require('../../index').getGenerator(obj, {
  handlerDir: path.join(__dirname, 'handler'),
  templateDir: path.join(__dirname, 'templates')
});
