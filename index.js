'use strict'
var Generator = require('yeoman-generator');

const path = require('path');
const fileUtils = require('./lib/util/file_utils');
const Adapter = require('./lib/adapter');
const Factory = require('./lib/factory');

module.exports.AbstractTemplateHandler = require('./lib/abstract_template_handler');
module.exports.FileUtils = fileUtils;
module.exports.getGenerator = (args0, opt) => {
  args0 = new Adapter(args0);

  return class extends Generator {
    constructor (args, opts) {
      super(args, opts);
      const _this = this;

      this.option('command', { desc: '使用命令模式（非交互操作）', alias: 'c', type: Boolean, default: false });
      args0.toOptions().forEach(option => {
        _this.option(option.key, option.val);
      })
      this.factory = new Factory(opt.handlerDir);
    }

    catch (e) {
      // if (e) {
      // console.log(e)
      // }
    };

    async prompting () {
      if (!this.options.command) {
        this.props = await this.prompt(args0.toPromptings());
      } else {
        const _this = this;
        args0.toOptions().forEach(option => {
          this.props[option.key] = _this.option[option.key];
        })
      }
    }

    write () {
      opt.beforeWrite(this.props);
      const dir = path.join(opt.templateDir)
      const files = fileUtils.readAllFileRecursivelySync(dir)

      files.forEach(f => {
        if (fileUtils.isTemplate(f)) {
          this.factory.create(f, this, this.props).handle();
        }
      })
    }
  }
}
