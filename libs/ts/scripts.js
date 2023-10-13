const fs = require('fs');
const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const path = require('path');
const requiredModules = ['@jswork/gulp-pkg-header', 'gulp-rename', 'gulp-typescript'];
const defaults = {
  src: ['src/**/*.ts', 'src/**/*.d.ts'],
  srcTypes: 'src/types/*.d.ts',
  dst: './dist',
  dstTypes: './dist/types',
  umdOptions: null,
};

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst, srcTypes, dstTypes, umdOptions } = this.options;
    if (!checkModules(requiredModules)) return Promise.resolve();

    const pkgHeader = require('@jswork/gulp-pkg-header');
    const rename = require('gulp-rename');
    const gulpTs = require('gulp-typescript');
    const tsconfig = require(path.join(process.cwd(), 'tsconfig.json'));
    const opts = tsconfig.compilerOptions;
    const umdModules = ['gulp-umd', 'gulp-prettier', 'gulp-replace'];

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

    // umd
    if (umdOptions) {
      if (!checkModules(umdModules)) return Promise.resolve();
      const umd = require('gulp-umd');
      const prettify = require('gulp-prettier');
      const replace = require('gulp-replace');

      taker.task('ts:scripts:umd', function () {
        return taker
          .src(src)
          .pipe(replace(/\/\/ ---- UMD DELETE ME ----(\s.*)+/g, ''))
          .pipe(gulpTs({ ...opts, module: 'umd' }))
          .pipe(umd(umdOptions))
          .pipe(prettify())
          .pipe(pkgHeader())
          .pipe(rename({ extname: '.umd.js' }))
          .pipe(taker.dest(dst));
      });
    }

    // typing for ts
    taker.task('ts:scripts:typing', function () {
      return taker
        .src(src)
        .pipe(pkgHeader())
        .pipe(gulpTs({ ...opts, declaration: true }))
        .pipe(taker.dest(dst));
    });

    taker.task('ts:scripts:types', function () {
      if (!fs.existsSync('src/types')) return Promise.resolve();
      return taker.src(srcTypes).pipe(taker.dest(dstTypes));
    });

    // main task
    taker.task(
      'ts:scripts',
      taker.series('ts:scripts:cjs', 'ts:scripts:esm', 'ts:scripts:typing', 'ts:scripts:types')
    );
  }
};
