const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const defaults = { src: 'src/**/*.ts', dst: './dist' };
const requiredModules = ['@jswork/gulp-pkg-header', 'gulp-replace', 'gulp-rename', 'gulp-typescript'];

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst } = this.options;
    if (!checkModules(requiredModules)) return Promise.resolve();

    const pkgHeader = require('@jswork/gulp-pkg-header');
    const replace = require('gulp-replace');
    const rename = require('gulp-rename');
    const gulpTs = require('gulp-typescript');
    const tsconfig = require('./tsconfig.json');
    const opts = tsconfig.compilerOptions;

    taker.task('scripts:cjs', function () {
      return taker
        .src(src)
        .pipe(replace('export default ', 'export = '))
        .pipe(pkgHeader())
        .pipe(gulpTs({ ...opts, module: 'commonjs' }))
        .pipe(taker.dest(dst));
    });

    taker.task('scripts:esm', function () {
      return taker
        .src(src)
        .pipe(pkgHeader())
        .pipe(gulpTs({ ...opts, module: 'esnext' }))
        .pipe(rename({ extname: '.esm.js' }))
        .pipe(taker.dest(dst));
    });

    taker.task('scripts:typing', function () {
      return taker
        .src(src)
        .pipe(pkgHeader())
        .pipe(gulpTs({ ...opts, declaration: true }))
        .pipe(taker.dest(dst));
    });

    taker.task('ts:scripts', taker.series('scripts:cjs', 'scripts:esm', 'scripts:typing'));
  }
};
