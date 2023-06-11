const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const defaults = { src: 'src/*.scss', dst: './dist', config: './webpack.config.js' };
const requiredModules = ['webpack-stream'];

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst, config } = this.options;

    taker.task('webpack', function () {
      if (!checkModules(requiredModules)) return Promise.resolve();
      const webpack = require('webpack-stream');
      const wpkConfig = config ? require(config) : {};
      return taker.src(src).pipe(webpack(wpkConfig)).pipe(taker.dest(dst));
    });
  }
};
