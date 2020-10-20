import commander from 'commander';
import PrettyError from 'pretty-error';
import _ from 'lodash';
import run from '@nicolascava/felfire-run';

import injectPlugins from './lib/helpers/injectPlugins';
import start from './lib/tasks/start';
import build from './lib/tasks/build';
import extract from './lib/tasks/extract';
import Config from './lib/config/Base';
import StaticDevConfig from './lib/webpack/static/development/Config';
import UniversalDevConfig from './lib/webpack/universal/development/Config';
import setUniversalProdConfig from './lib/webpack/universal/production/setConfig';
import ServerDevConfig from './lib/webpack/server/development/Config';
import ServerProdConfig from './lib/webpack/server/production/Config';

const prettyError = new PrettyError();

async function handleStartCommand(options) {
  const proxy = _.isUndefined(options.proxy) ? true : options.proxy;

  let webpackConfig = null;

  if (Config.mode === 'static') {
    webpackConfig = StaticDevConfig;
  } else if (Config.mode === 'universal') {
    webpackConfig = UniversalDevConfig;
  } else {
    webpackConfig = ServerDevConfig;
  }

  return run(start, { webpackConfig, proxy });
}

async function handleBuildCommand(environment) {
  let webpackConfig = null;

  if (Config.mode === 'universal') {
    webpackConfig = setUniversalProdConfig(environment);
  } else {
    webpackConfig = ServerProdConfig;
  }

  return run(build, { webpackConfig });
}

async function handleExtractCommand() {
  return run(extract, {
    sourceDir: Config.sourceDir,
  });
}

function handleMissingCommand() {
  throw new Error('Unknown task. See all available commands in the documentation: ' +
    'https://github.com/nicolascava/felfire');
}

prettyError.start();

commander.version(Config.compilerVersion);

commander
  .command('start')
  .option('--no-proxy', '(optional) watch file changes without using proxy')
  .action(handleStartCommand);

commander
  .command('build')
  .option('--environment', '(optional) specify an environment')
  .action(handleBuildCommand);

commander
  .command('extract')
  .action(handleExtractCommand);

Config.plugins.forEach(plugin => injectPlugins({ commander, plugin }));

commander
  .command('*')
  .action(handleMissingCommand);

commander.parse(process.argv);
