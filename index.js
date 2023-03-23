module.exports = {
  CleanRegistry: require('./libs/clean'),
  TailwindRegistry: require('./libs/tailwind'),
  JsonRegistry: require('./libs/json'),
  ScssRegistry: require('./libs/scss'),
  Typescript: require('./libs/typescript'),

  // generators
  NxScripts: require('./libs/nx/scripts'),
  TsScripts: require('./libs/ts/scripts'),
};
