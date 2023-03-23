const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const defaults = { src: 'src/**/*.ts', dst: './dist' };
const { join } = require('path');
const requiredModules = [
  '@jswork/gulp-pkg-header',
  'gulp-esbuild',
  'gulp-typescript',
  'esbuild-node-externals',
  'esbuild-plugin-clean',
  'esbuild-plugin-replace',
];

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst } = this.options;
    if (!checkModules(requiredModules)) return Promise.resolve();

    const pkgHeader = require('@jswork/gulp-pkg-header');
    const gulpTs = require('gulp-typescript');
    const gulpEsbuild = require('gulp-esbuild');
    const { nodeExternalsPlugin } = require('esbuild-node-externals');
    const { clean } = require('esbuild-plugin-clean');
    const { replace } = require('esbuild-plugin-replace');
    const cwd = process.cwd();
    const tsconfig = require(join(cwd, 'tsconfig.json'));
    const pkg = require(join(cwd, 'package.json'));
    const opts = tsconfig.compilerOptions;

    const shared = {
      entryPoints: ['src/index.ts'],
      bundle: true,
      minify: true,
      platform: 'node',
      sourcemap: true,
      target: 'node14',
      plugins: [
        clean({
          patterns: ['./dist/*'],
        }),
        nodeExternalsPlugin(),
        replace({
          'export default ': 'export = ',
          '__VERSION__': pkg.version,
        }),
      ],
    };

    taker.task('esb:scripts:cjs', function () {
      return taker
        .src(src)
        .pipe(gulpEsbuild({ ...shared, format: 'cjs', outfile: 'index.js' }))
        .pipe(pkgHeader())
        .pipe(taker.dest(dst));
    });

    taker.task('esb:scripts:esm', function () {
      return taker
        .src(src)
        .pipe(gulpEsbuild({ ...shared, format: 'esm', outfile: 'index.esm.js' }))
        .pipe(pkgHeader())
        .pipe(taker.dest(dst));
    });

    // typing for ts
    taker.task('esb:scripts:typing', function () {
      return taker
        .src(src)
        .pipe(gulpTs({ ...opts, declaration: true }))
        .pipe(pkgHeader())
        .pipe(taker.dest(dst));
    });

    // main task
    taker.task(
      'esb:scripts',
      taker.series('esb:scripts:cjs', 'esb:scripts:esm', 'esb:scripts:typing')
    );
  }
};
