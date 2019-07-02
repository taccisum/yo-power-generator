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
  constructor (name, prompting, option, parent, children, generator) {
    this.name = name;
    this.prompting = prompting;
    this.option = option;
    this.parent = parent;
    this.children = children;
    this.generator = generator;
  }

  /**
   * @returns {*}
   */
  async prompt () {
    const answers = {};
    if (this.prompting) {
      // TODO:: support condition
      const answer = await this.generator.prompt(_.assignIn({ name: this.name }, this.prompting));
      _.assignIn(answers, answer);
    }
    if (this.children) {
      for (const idx in this.children) {
        const child = this.children[idx];
        _.assignIn(answers, await child.prompt());
      }
    }
    return answers;
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
      const child = new Argument(key, val.prompting, val.option, node, [], generator);
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
