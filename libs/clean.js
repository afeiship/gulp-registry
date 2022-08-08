const DefaultRegistry = require('undertaker-registry');
const del = require('del');
const defaults = { target: './dist' };

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { target } = this.options;
    taker.task('clean', function () {
      return del(target);
    });
  }
};
