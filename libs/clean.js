const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const defaults = { dest: './dist' };

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { dest } = this.options;
    taker.task('clean', function () {
      if (!checkModules(['del'])) return Promise.resolve();
      const del = require('del');
      return del(dest);
    });
  }
};
