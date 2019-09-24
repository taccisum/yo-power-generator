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
  async prompt (answers = {}, tap = 0) {
    if (this._isTrigger(answers)) {
      if (this.prompting) {
        let message = this.prompting.message;
        if (tap > 0) {
          message = this._getIndent(tap) + `> ${this.prompting.message}`;
        }
        const answer = await this.generator.prompt(_.assignIn({ name: this.name }, this.prompting, { message }));
        _.assignIn(answers, answer);
      }
      if (this.children) {
        if (this.prompting) {
          tap += 1;
        }
        for (const idx in this.children) {
          const child = this.children[idx];
          await child.prompt(answers, tap);
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

  toForm () {
    const form = this._toForm(this);
    if (!form.type) {
      return form.child;
    }
    return form;
  }

  _toForm (argument) {
    let form = { ...argument.prompting };
    if (argument.option) {
      const defaultVal = argument.option.default;
      if (defaultVal) {
        form.default = defaultVal;
      }
    }
    if (argument.callbacks && _.isArray(argument.callbacks.trigger)) {
      form.trigger = [];
      for (const trigger of argument.callbacks.trigger) {
        form.trigger.push(trigger.toForm());
      }
    }
    if (!_.isEmpty(argument.children)) {
      form.child = {};
      for (const obj of argument.children) {
        form.child[obj.name] = obj.toForm();
      }
    }
    return form;
  }

  _getIndent (num) {
    let indent = '';
    for (let i = 0; i < num; i++) {
      indent += ' ';
    }
    return indent;
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
