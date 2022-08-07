const DefaultRegistry = require('undertaker-registry');
const del = require('del');
const defaults = { buildDir: './dist' };

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const buildDir = this.options.buildDir;
    taker.task('clean', function () {
      return del(buildDir);
    });
  }
};
