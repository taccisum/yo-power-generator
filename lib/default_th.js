'use strict';

const AbstractTemplateHandler = require('./abstract_template_handler');
const _ = require('lodash')
const fileUtils = require('./util/file_utils');

class DefaultTemplateHandler extends AbstractTemplateHandler {
  _handle0 () {
    const tpl = _.template(this.generator.fs.read(this.generator.templatePath(this.tmpl)));
    const destTpl = _.template(fileUtils.tmplToFileName(this.tmpl));
    this.generator.fs.write(
      this.generator.destinationPath(destTpl(this.props)),
      tpl(this.props)
    )
  }
}

module.exports = {
  key: 'default',
  cls: DefaultTemplateHandler
};
