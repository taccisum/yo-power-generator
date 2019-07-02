'use strict';

const fs = require('fs');
const path = require('path');
const fileUtils = require('./util/file_utils');
const debug = require('debug')('pg:template_handler_factory');

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
    const defaultHandler = require('./default_th');
    handlers[defaultHandler.key] = defaultHandler.cls;

    if (fs.existsSync(this.dir) && fs.statSync(this.dir).isDirectory()) {
      const files = fs.readdirSync(this.dir);
      files.forEach(file => {
        const absPath = path.join(this.dir, file)
        if (fs.statSync(absPath).isFile()) {
          const obj = require(absPath);
          debug(`register handler ${obj.key} from ${absPath}`);
          handlers[obj.key] = obj.cls;
        }
      })
    }
    this.handlers = handlers;
  }

  create (tmpl, generator, props) {
    const type = fileUtils.extractTmplType(tmpl);
    let Cls = this.handlers[type];
    if (Cls) {
      return new Cls(tmpl, generator, props);
    } else {
      throw new Error('can not found any handler for template type: ' + type);
    }
  }
}

module.exports = TemplateHandlerFactory;
