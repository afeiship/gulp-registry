const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const defaults = { src: 'src/*.scss', dst: './dist' };
const requiredModules = [
  'sass',
  'gulp-dart-sass',
  'gulp-rename',
  'gulp-postcss',
  'autoprefixer',
  'cssnano',
];

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { dst } = this.options;
    taker.task('sass', function () {
      if (!checkModules(requiredModules)) return Promise.resolve();
      const sass = require('gulp-dart-sass');
      const rename = require('gulp-rename');
      const postcss = require('gulp-postcss');
      const autoprefixer = require('autoprefixer');
      const cssnano = require('cssnano');
      const { src, dst } = taker;
      return src('./src/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest(dst));
    });
  }
};
