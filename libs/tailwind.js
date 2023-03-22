const DefaultRegistry = require('undertaker-registry');
const defaults = { src: './src/index.scss', dst: '.' };
const requiredModules = ['gulp-postcss', 'gulp-dart-sass', 'gulp-sass-glob'];

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst } = this.options;
    taker.task('tailwind', function () {
      const checkModules = require('@jswork/check-modules');
      if (!checkModules(requiredModules)) return Promise.resolve();

      const postcss = require('gulp-postcss');
      const sass = require('gulp-dart-sass');
      const sassGlob = require('gulp-sass-glob');

      return taker
        .src(src)
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(postcss())
        .pipe(taker.dest(dst));
    });
  }
};
