'use strict';

const fs = require('fs');
const path = require('path');
const fileUtils = require('./util/file_utils');

class TemplateHandlerFactory {
  constructor (dir) {
    this.dir = dir;
    if (!this.dir) {
      this.dir = path.join(process.cwd(), 'handler');
    }
    this._init();
  }

  _init () {
    const handlers = {};
    const files = fs.readdirSync(this.dir);
    files.forEach(file => {
      const obj = require(path.join(this.dir, file));
      handlers[obj.key] = obj.cls;
    })
    this.handlers = handlers;
  }

  create (tmpl, generator, props) {
    const type = fileUtils.extractTmplType(tmpl);
    let Cls = this.handlers[type];
    return new Cls(tmpl, generator, props);
  }
}

module.exports = TemplateHandlerFactory;
