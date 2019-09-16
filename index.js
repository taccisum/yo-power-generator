'use strict'
var Generator = require('yeoman-generator');

const path = require('path');
const fileUtils = require('./lib/util/file_utils');
const Argument = require('./lib/argument');
const Factory = require('./lib/factory');
const debug = require('debug')('pg:generator');

module.exports.Trigger = {
  AbstractTrigger: require('./lib/abstract_trigger'),
  AnyAnswerTrigger: require('./lib/trigger/any_answer_trigger')
};
module.exports.AbstractTemplateHandler = require('./lib/abstract_template_handler');
module.exports.FileUtils = fileUtils;
module.exports.getGenerator = (args0, opt) => {
  return class extends Generator {
    constructor (args, opts) {
      super(args, opts);
      this.argument = Argument.builder(args0, this);
      const _this = this;

      this.option('command', { desc: '使用命令模式（非交互操作）', alias: 'c', type: Boolean, default: false });
      this.option('description', { desc: '脚手架描述', alias: 'desc', type: Boolean, default: false });
      this.option('form', { desc: '脚手架表单', alias: 'f', type: Boolean, default: false });

      this.argument.options().forEach(option => {
        _this.option(option.key, option.val);
      })
      this.factory = new Factory(opt.handlerDir);
    }

    catch (e) {

    }

    async prompting () {
      if (this.options.description) {
        this.log(opt.description);
        return;
      }

      if (this.options.form) {
        const form = this.argument.toForm();
        this.log(JSON.stringify(form));
        return;
      }

      let cliOptsStr = '';
      if (this.options.command) {
        const _this = this;
        this.props = {};

        this.argument.options().forEach(option => {
          const key = option.key;
          const val = _this.options[option.key];
          cliOptsStr += ` --${key}=${val}`
          this.props[key] = val;
        })
        this.props.mode = 'command';
      } else {
        const answer = await this.argument.prompt();

        cliOptsStr = Object.keys(answer).map(key => {
          if (answer[key]) {
            return `--${key}=${answer[key]}`;
          }
        }).filter(val => { return !!val }).join(' ');

        this.props = answer;
        this.props.mode = 'interaction';
      }
      this.props.cli = cliOptsStr.trim();

      debug(`props: ${JSON.stringify(this.props)}`);
      opt.afterPropsSet && opt.afterPropsSet(this.props);
    }

    write () {
      if (this.options.description || this.options.form) {
        return;
      }

      const dir = path.join(opt.templateDir)
      const files = fileUtils.readAllFileRecursivelySync(dir)
      debug(`all files: ${JSON.stringify(files)}`)

      files.forEach(f => {
        if (fileUtils.isTemplate(f)) {
          this.factory.create(f, this, this.props).handle();
        } else {
          debug(`file ${f} is not a template.`)
        }
      })
    }
  }
}
