const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const capitalize = require('capitalize');
const defaults = { src: 'src/*.js', dst: './dist', name: 'qs', classify: false };
const requiredModules = [
  '@jswork/gulp-pkg-header',
  'gulp-insert',
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
    const insert = require('gulp-insert');
    const prettier = require('gulp-prettier');
    const pkgHeader = require('@jswork/gulp-pkg-header');
    const uglify = require('gulp-uglify');
    const replace = require('gulp-replace');
    const rename = require('gulp-rename');

    taker.task('nx:scripts.cjs', function () {
      return taker
        .src(src)
        .pipe(insert.wrap(`(function () {`, '})();'))
        .pipe(prettier())
        .pipe(pkgHeader())
        .pipe(taker.dest(dst))
        .pipe(uglify({ output: { comments: saveLicense } }));
    });

    taker.task('nx:scripts.esm', () => {
      const expName = classify ? capitalize(name) : name;
      const exports = `export default nx.${expName};`;
      return taker
        .src(src)
        .pipe(pkgHeader())
        .pipe(replace('global || this || window', 'global || this'))
        .pipe(replace(/if \(typeof module !== 'undefined' && module\.exports.*\s+.*\s+}/, exports))
        .pipe(rename({ extname: '.esm.js' }))
        .pipe(taker.dest(dst));
    });

    taker.task('nx:scripts', taker.series('nx:scripts.cjs', 'nx:scripts.esm'));
  }
};
