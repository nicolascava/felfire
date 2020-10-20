import path from 'path';

import BaseConfig from '../development/Config';
import Config from '../../../config/Base';
import { clientRules, serverRules } from './Rules';
import setPlugins from './setPlugins';

const rootComponentAliasPath = path.resolve(
  process.cwd(),
  Config.sourceDir,
  './components/Root/index.js',
);
const websiteContainerAliasPath = path.resolve(
  process.cwd(),
  Config.sourceDir,
  './containers/Website/index.js',
);
const websiteReducerAliasPath = path.resolve(
  process.cwd(),
  Config.sourceDir,
  './redux/modules/website.js',
);
const reducersAliasPath = path.resolve(
  process.cwd(),
  Config.sourceDir,
  './redux/modules/reducer.js',
);

/**
 * Set Webpack production configuration
 *
 * @param {String} locale
 * @returns {Array}
 */
function setProdConfig(locale = 'en') {
  const { clientPlugins, serverPlugins } = setPlugins(locale);
  const outputPath = path.resolve(process.cwd(), Config.buildDir, locale);
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
      path: outputPath,
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
    entry: {
      app: path.join(__dirname, '../../../helpers/generateStaticFiles.js'),
    },
    output: {
      path: outputPath,
      publicPath: BaseConfig[1].output.publicPath,
      filename: BaseConfig[1].output.filename,
      libraryTarget: BaseConfig[1].output.libraryTarget,
    },
    resolve: {
      ...BaseConfig[1].resolve,
      alias: {
        'root-component-alias': rootComponentAliasPath,
        'website-container-alias': websiteContainerAliasPath,
        'website-reducer-alias': websiteReducerAliasPath,
        'reducers-alias': reducersAliasPath,
      },
    },
    stats: BaseConfig[1].stats,
    module: {
      noParse: BaseConfig[1].module.noParse,
      rules: serverRules,
    },
    plugins: serverPlugins,
  };

  return [clientConfig, serverConfig];
}

export default setProdConfig;
