const DefaultRegistry = require('undertaker-registry');
const defaults = {
  buildDir: './dist',
};

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const buildDir = this.options.buildDir;
    const exists = fs.existsSync(buildDir);

    if (exists) {
      throw new Error('Cannot initialize clean registry. `' + buildDir + '` directory exists.');
    }

    taker.task('clean', function () {
      return del([buildDir]);
    });
  }
};
