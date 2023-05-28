const path = require('path');
const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const defaults = { src: './src/index.scss', dst: '.' };
const requiredModules = [
  'gulp-postcss',
  'gulp-dart-sass',
  'gulp-sass-glob',
  'postcss',
  'tailwindcss',
  'autoprefixer',
];

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst } = this.options;
    taker.task('tailwind', function () {
      if (!checkModules(requiredModules)) return Promise.resolve();
      const cwd = process.cwd();
      const postcss = require('gulp-postcss');
      const sass = require('gulp-dart-sass');
      const sassGlob = require('gulp-sass-glob');
      const tailwindcss = require('tailwindcss');
      const autoprefixer = require('autoprefixer');
      const tailwindConfig = path.join(cwd, 'tailwind.config.js');

      return taker
        .src(src)
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(postcss([tailwindcss(tailwindConfig), autoprefixer()]))
        .pipe(taker.dest(dst));
    });
  }
};
