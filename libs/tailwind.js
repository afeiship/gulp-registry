const DefaultRegistry = require('undertaker-registry');
const postcss = require('gulp-postcss');
const sass = require('gulp-dart-sass');
const sassGlob = require('gulp-sass-glob');
const defaults = { src: './src/index.scss', dest: '.' };

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dest } = this.options;
    taker.task('tailwind', function () {
      return taker
        .src(src)
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(postcss())
        .pipe(taker.dest(dest));
    });
  }
};
