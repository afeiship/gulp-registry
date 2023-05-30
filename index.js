module.exports = {
  CleanRegistry: require('./libs/clean'),
  InlineSource: require('./libs/inline-source'),
  TailwindRegistry: require('./libs/tailwind'),
  JsonRegistry: require('./libs/json'),
  ScssRegistry: require('./libs/scss'),
  Typescript: require('./libs/typescript'),

  // generators
  NxScripts: require('./libs/nx/scripts'),
  TsScripts: require('./libs/ts/scripts'),
  EsbScripts: require('./libs/ts/esb.scripts'),
};
