const DefaultRegistry = require('undertaker-registry');
const defaults = {};

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    taker.task('typescript:tsc', function () {
      const execa = require('execa');
      return execa('tsc');
    });
  }
};
