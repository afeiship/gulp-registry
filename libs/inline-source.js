const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const defaults = { src: './src/*.html', dst: 'dist' };
const requiredModules = ['gulp-inline-source'];

// https://github.com/fmal/gulp-inline-source

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst } = this.options;
    taker.task('inline-source', function () {
      if (!checkModules(requiredModules)) return Promise.resolve();
      const inlinesource = require('gulp-inline-source');
      return taker.src(src).pipe(inlinesource()).pipe(taker.dest(dst));
    });
  }
};
