const DefaultRegistry = require('undertaker-registry');
const checkModules = require('@jswork/check-modules');
const nx = require('@jswork/next');
const defaults = { src: 'src/*.scss', dst: './dist', config: null };
const requiredModules = ['webpack-stream'];

module.exports = class extends DefaultRegistry {
  constructor(inOptions) {
    super(inOptions);
    this.options = { ...defaults, ...inOptions };
  }

  init(taker) {
    const { src, dst, config } = this.options;

    taker.task('webpack:development', function () {
      if (!checkModules(requiredModules)) return Promise.resolve();
      const webpack = require('webpack-stream');
      const wpkConfig = nx.get(config, 'development', config) || { mode: 'development' };
      return taker.src(src).pipe(webpack(wpkConfig)).pipe(taker.dest(dst));
    });

    taker.task('webpack:production', function () {
      if (!checkModules(requiredModules)) return Promise.resolve();
      const webpack = require('webpack-stream');
      const wpkConfig = nx.get(config, 'production', config) || { mode: 'production' };
      return taker.src(src).pipe(webpack(wpkConfig)).pipe(taker.dest(dst));
    });
  }
};
