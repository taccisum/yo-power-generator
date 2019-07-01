'use strict';
const debug = require('debug')('pg:abstract_template_handler');

class AbstractTemplateHandler {
  constructor (tmpl, generator, props) {
    this.tmpl = tmpl;
    this.generator = generator;
    this.props = props;
  }

  handle () {
    if (this._ignore()) {
      debug(`template ${this.tmpl} has been ignored!`);
      return;
    }
    this._handle0();
  }

  _ignore () {
    return false;
  }

  _handle0 () {
    throw new Error('must implement _handle0()');
  }
}

module.exports = AbstractTemplateHandler;
