'use strict';

class AbstractTrigger {
  isTrigger (answers) {
    throw new Error('not implement');
  }

  toForm () {
    throw new Error('not implement');
  }
}

module.exports = AbstractTrigger;
