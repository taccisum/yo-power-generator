'use strict';
// eslint-disable-next-line no-unused-vars
const Generator = require('yeoman-generator');
const _ = require('lodash');

class Argument {
  /**
   * @param {String} name
   * @param {*} prompting
   * @param {*} option
   * @param {Argument} parent
   * @param {Array<Argument>} children
   * @param {Generator} generator
   */
  constructor (name, prompting, option, parent, children, generator, callbacks) {
    this.name = name;
    this.prompting = prompting;
    this.option = option;
    this.parent = parent;
    this.children = children;
    this.generator = generator;
    this.callbacks = {};
    _.assignIn(this.callbacks, {
      trigger (answers) {
        return true;
      }
    }, callbacks);
  }

  /**
   * @param {*} answers 递归调用时的传参，一般不需要传
   * @returns {*}
   */
  async prompt (answers = {}) {
    if (this._isTrigger(answers)) {
      if (this.prompting) {
        const answer = await this.generator.prompt(_.assignIn({ name: this.name }, this.prompting));
        _.assignIn(answers, answer);
      }
      if (this.children) {
        for (const idx in this.children) {
          const child = this.children[idx];
          await child.prompt(answers);
        }
      }
    }
    return answers;
  }

  _isTrigger (answers) {
    const trigger = this.callbacks.trigger;
    if (_.isFunction(trigger)) {
      return trigger(answers);
    } else if (_.isArray(trigger)) {
      for (const t of trigger) {
        if (_.isFunction(t.isTrigger) && !t.isTrigger(answers)) {
          return false;
        }
      }
      return true;
    }
    throw new Error('trigger 类型仅支持数组或函数');
  }

  /**
   * @returns {Array}
   */
  options () {
    const options = [];
    if (this.option) {
      options.push({
        key: this.name,
        val: this.option
      });
    }
    if (this.children) {
      for (const idx in this.children) {
        const child = this.children[idx];
        options.push(...child.options());
      }
    }
    return options;
  }
}

module.exports = Argument;

module.exports.builder = (obj, generator) => {
  const root = new Argument('root', null, null, null, [], generator);

  function setChildren (node, o) {
    const children = [];

    Object.keys(o).forEach(key => {
      const val = o[key];
      const child = new Argument(key, val.prompting, val.option, node, [], generator, val.callbacks);
      if (val.child) {
        setChildren(child, val.child);
      }
      children.push(child);
    })
    node.children = children;
  }

  setChildren(root, obj);

  return root;
}

function toForm (opt) {
  const form = {};
  Object.keys(opt).forEach(key => {
    const val = opt[key];
    if (_.isEmpty(val)) {
      return;
    }
    form[key] = val.prompting;
    if (val.option) {
      const defaultVal = val.option.default;
      if (!_.isEmpty(defaultVal)) {
        form[key].default = defaultVal;
      }
    }
    if (val.callbacks && _.isArray(val.callbacks.trigger)) {
      form[key].trigger = [];
      for (const trigger of val.callbacks.trigger) {
        form[key].trigger.push(trigger.toForm());
      }
    }
    if (val.child) {
      form[key].child = toForm(val.child);
    }
  });
  return form;
}

module.exports.toForm = toForm;
