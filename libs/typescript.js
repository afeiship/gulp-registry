const DefaultRegistry = require('undertaker-registry');
const execa = require('execa');
const defaults = {};

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    taker.task('typescript:tsc', function () {
      return execa('tsc');
    });
  }
};
