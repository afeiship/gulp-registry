const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const defaults = { src: 'src/**/*.ts', dst: './dist' };
const path = require('path');
const requiredModules = ['@jswork/gulp-pkg-header', 'gulp-rename', 'gulp-typescript'];

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst } = this.options;
    if (!checkModules(requiredModules)) return Promise.resolve();

    const pkgHeader = require('@jswork/gulp-pkg-header');
    const rename = require('gulp-rename');
    const gulpTs = require('gulp-typescript');
    const tsconfig = require(path.join(process.cwd(), 'tsconfig.json'));
    const opts = tsconfig.compilerOptions;

    // cjs for nodejs
    taker.task('ts:scripts:cjs', function () {
      return taker
        .src(src)
        .pipe(pkgHeader())
        .pipe(gulpTs({ ...opts, module: 'commonjs' }))
        .pipe(taker.dest(dst));
    });

    // esm for browser
    taker.task('ts:scripts:esm', function () {
      return taker
        .src(src)
        .pipe(pkgHeader())
        .pipe(gulpTs({ ...opts, module: 'esnext' }))
        .pipe(rename({ extname: '.esm.js' }))
        .pipe(taker.dest(dst));
    });

    // typing for ts
    taker.task('ts:scripts:typing', function () {
      return taker
        .src(src)
        .pipe(pkgHeader())
        .pipe(gulpTs({ ...opts, declaration: true }))
        .pipe(taker.dest(dst));
    });

    // main task
    taker.task('ts:scripts', taker.series('ts:scripts:cjs', 'ts:scripts:esm', 'ts:scripts:typing'));
  }
};
