'use strict';

const AbstractTrigger = require('../abstract_trigger');

class NoAnyAnswerTrigger extends AbstractTrigger {
  constructor (answer, ...value) {
    super();
    this.answer = answer;
    this.value = value;
  }

  isTrigger (answers) {
    if (!answers) {
      return false;
    }
    if (!answers[this.answer]) {
      return false;
    }
    return !this.value.includes(answers[this.answer]);
  }

  toForm () {
    return {
      type: 'noAnyAnswerTrigger',
      answer: this.answer,
      value: [...this.value]
    };
  }
}

module.exports = NoAnyAnswerTrigger;
