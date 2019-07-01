'use strict'
var Generator = require('yeoman-generator');

const path = require('path');
const fileUtils = require('./lib/util/file_utils');
const Adapter = require('./lib/adapter');
const Factory = require('./lib/factory');
const debug = require('debug')('pg:generator');

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
        const answer = await this.prompt(args0.toPromptings());

        const cliOptsStr = Object.keys(answer).map(key => {
          if (answer[key]) {
            return `--${key}=${answer[key]}`;
          }
        }).filter(val => { return !!val }).join(' ');

        console.log('你也可以使用以下命令来生成脚手架：')
        console.log(`yo xxx ${cliOptsStr}`);

        this.props = answer;
      } else {
        const _this = this;
        this.props = {};
        args0.toOptions().forEach(option => {
          this.props[option.key] = _this.options[option.key];
        })
      }
      debug(`props: ${JSON.stringify(this.props)}`);
      opt.afterPropsSet(this.props);
    }

    write () {
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
