const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const defaults = { src: './src/*.json', dst: 'dist' };

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dest } = this.options;
    taker.task('json:min', function () {
      if (!checkModules(['gulp-json-minify'])) return Promise.resolve();
      const jsonMinify = require('gulp-json-minify');
      return taker.src(src).pipe(jsonMinify()).pipe(taker.dest(dst));
    });
  }
};
