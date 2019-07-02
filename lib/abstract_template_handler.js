'use strict';
const debug = require('debug')('pg:abstract_template_handler');
const fileUtils = require('./util/file_utils');

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
    const conditions = fileUtils.extractConditions(this.tmpl)
    let ignored = false;
    for (let idx in conditions) {
      const condition = conditions[idx];
      if (!!this.props[condition] === false && !!this.props.conditions[condition] === false) {
        // ingore if any condition not matched
        ignored = true;
        break;
      }
    }
    return ignored;
  }

  _handle0 () {
    throw new Error('must implement _handle0()');
  }
}

module.exports = AbstractTemplateHandler;
