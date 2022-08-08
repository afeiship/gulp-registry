const DefaultRegistry = require('undertaker-registry');
const postcss = require('gulp-postcss');
const sass = require('gulp-dart-sass');
const defaults = { src: './src/index.scss', dst: '.' };

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst } = this.options;
    taker.task('tailwind', function () {
      return taker
        .src(src)
        .pipe(sass())
        .pipe(postcss())
        .pipe(taker.dest(dst));
    });
  }
};
