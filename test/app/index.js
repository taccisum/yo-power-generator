'use strict'
const path = require('path');

const obj = {
  groupId: {
    prompting: { type: 'input', message: '请输入你的group id', default: 'com.deepexi' },
    option: { desc: 'group id', type: String, default: 'com.deepexi' }
  }
}

module.exports = require('../../index').getGenerator(obj, {
  handlerDir: path.join(__dirname, 'handler'),
  templateDir: path.join(__dirname, 'templates')
});
