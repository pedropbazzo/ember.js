const Babel = require('broccoli-babel-transpiler');
const {
  resolveRelativeModulePath,
  getRelativeModulePath,
} = require('ember-cli-babel/lib/relative-module-paths');
const enifed = require('./transforms/transform-define');
const injectNodeGlobals = require('./transforms/inject-node-globals');

module.exports = function processModulesOnly(tree, strict = false) {
  let transformOptions = { noInterop: true };

  // These options need to be exclusive for some reason, even the key existing
  // on the options hash causes issues.
  if (strict) {
    transformOptions.strict = true;
  } else {
    transformOptions.loose = true;
  }

  let options = {
    sourceMaps: true,
    plugins: [
      // ensures `@glimmer/compiler` requiring `crypto` works properly
      // in both browser and node-land
      injectNodeGlobals,
      ['@babel/transform-template-literals', { loose: true }],
      ['module-resolver', { resolvePath: resolveRelativeModulePath }],
      ['@babel/transform-modules-amd', transformOptions],
      enifed,
    ],
    moduleIds: true,
    getModuleId: getRelativeModulePath,
  };

  return new Babel(tree, options);
};
