import path from 'path';
import _ from 'lodash';
import run from '@nicolascava/felfire-run';

import Log from './Log';
import Config from '../config/Base';

function handleAction(requiredPlugin, compiler, commander) {
  return async () => run(requiredPlugin.default, { compiler, commander });
}

/**
 * Inject plugins into compiler
 *
 * @param {Object|Array} plugin
 * @param {Object} commander
 * @returns {Object}
 */
export default function ({ plugin, commander }) {
  const compiler = { log: Log, config: Config };
  const pluginNameWithoutPrefix = plugin[0].indexOf('felfire-') > -1 ?
    plugin[0].slice('felfire-'.length) : plugin[0];
  const pluginPath = path.join(process.cwd(), '..', `felfire-${pluginNameWithoutPrefix}`);

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const requiredPlugin = require(pluginPath);

  if (_.isUndefined(requiredPlugin.init)) {
    return commander
      .command(pluginNameWithoutPrefix)
      .action(handleAction(requiredPlugin, compiler, commander));
  }

  return requiredPlugin
    .init(commander.command(pluginNameWithoutPrefix))
    .action(handleAction(requiredPlugin, compiler, commander));
}
