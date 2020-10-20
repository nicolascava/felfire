import path from 'path';

import BaseConfig from '../development/Config';
import Config from '../../../config/Base';
import { clientRules, serverRules } from './Rules';
import setPlugins from './setPlugins';

function setConfig(environment) {
  const { clientPlugins, serverPlugins } = setPlugins(environment);
  const clientConfig = {
    stats: BaseConfig[0].stats,
    context: BaseConfig[0].context,
    target: BaseConfig[0].target,
    name: BaseConfig[0].name,
    resolve: BaseConfig[0].resolve,
    node: BaseConfig[0].node,
    entry: {
      app: path.join(process.cwd(), Config.sourceDir, './client.js'),
      async: path.join(process.cwd(), Config.sourceDir, './async.js'),
    },
    output: {
      path: BaseConfig[0].output.path,
      chunkFilename: BaseConfig[0].output.chunkFilename,
      filename: BaseConfig[0].output.filename,
      publicPath: Config.cdnEndpoint,
    },
    module: {
      noParse: BaseConfig[0].module.noParse,
      rules: clientRules,
    },
    plugins: clientPlugins,
  };
  const serverConfig = {
    context: BaseConfig[1].context,
    name: BaseConfig[1].name,
    target: BaseConfig[1].target,
    externals: BaseConfig[1].externals,
    entry: BaseConfig[1].entry,
    output: BaseConfig[1].output,
    resolve: BaseConfig[1].resolve,
    stats: BaseConfig[1].stats,
    module: {
      noParse: BaseConfig[1].module.noParse,
      rules: serverRules,
    },
    plugins: serverPlugins,
  };

  return [clientConfig, serverConfig];
}

export default setConfig;
