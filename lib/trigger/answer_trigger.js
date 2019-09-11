'use strict';

const AbstractTrigger = require('../abstract_trigger');

class AnswerTrigger extends AbstractTrigger {
  constructor (answer, ...value) {
    super();
    this.answer = answer;
    this.value = value;
  }

  isTrigger (answers) {
    if (!answers) {
      return false;
    }
    return this.value.includes(answers[this.answer]);
  }

  toForm () {
    return {
      type: 'answerTrigger',
      parent: this.answer,
      value: [...this.value]
    };
  }
}

module.exports = AnswerTrigger;
