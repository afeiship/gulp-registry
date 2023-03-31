const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const capitalize = require('capitalize');
const defaults = { src: 'src/*.js', dst: './dist', name: 'qs', classify: false };
const requiredModules = [
  '@jswork/gulp-pkg-header',
  'gulp-babel',
  'gulp-uglify',
  'gulp-prettier',
  'gulp-replace',
  'gulp-rename',
  'uglify-save-license',
];

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst, name, classify } = this.options;
    if (!checkModules(requiredModules)) return Promise.resolve();

    const saveLicense = require('uglify-save-license');
    const prettier = require('gulp-prettier');
    const pkgHeader = require('@jswork/gulp-pkg-header');
    const babel = require('gulp-babel');
    const replace = require('gulp-replace');
    const rename = require('gulp-rename');
    const uglify = require('gulp-uglify');

    taker.task('nx:scripts.cjs', function () {
      return taker
        .src(src)
        .pipe(babel())
        .pipe(pkgHeader())
        .pipe(prettier())
        .pipe(taker.dest('dist'))
        .pipe(uglify({ output: { comments: saveLicense } }));
    });

    taker.task('nx:scripts.esm', () => {
      return taker
        .src(src)
        .pipe(pkgHeader())
        .pipe(rename({ extname: '.esm.js' }))
        .pipe(taker.dest(dst));
    });

    taker.task('nx:scripts', taker.series('nx:scripts.cjs', 'nx:scripts.esm'));
  }
};
