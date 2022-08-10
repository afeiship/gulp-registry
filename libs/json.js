const DefaultRegistry = require('undertaker-registry');
const jsonMinify = require('gulp-json-minify');
const defaults = { src: './src/*.json', dest: 'dist' };

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dest } = this.options;
    taker.task('json:min', function () {
      return taker
        .src(src)
        .pipe(jsonMinify())
        .pipe(taker.dest(dest));
    });
  }
};
