import {
  DefinePlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin,
  NamedModulesPlugin,
  BannerPlugin,
} from 'webpack';
import WriteFilePlugin from 'write-file-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import path from 'path';

import Config from '../../../config/Base';

function resolveNormalizedEnv() {
  const keys = Object.keys(Config.environment.development);

  return keys.reduce((accumulation, current) => ({
    ...accumulation,
    [current]: JSON.stringify(Config.environment.development[current]),
  }), {});
}

let normalizedEnv = {};

if (Config.environment.development) normalizedEnv = resolveNormalizedEnv();

const felfirePlugin = {
  config: JSON.stringify(Config),
};
const definePluginClientOpts = {
  felfire: felfirePlugin,
  'process.env': {
    ...normalizedEnv,
    IS_CLIENT: JSON.stringify(false),
    IS_SERVER: JSON.stringify(true),
  },
};
const definePluginServerOpts = {
  felfire: felfirePlugin,
  'process.env': {
    ...normalizedEnv,
    IS_CLIENT: JSON.stringify(false),
    IS_SERVER: JSON.stringify(true),
  },
};
const assetsPluginOpts = {
  path: path.resolve(process.cwd(), Config.buildDir),
};
const bannerPluginOpts = {
  banner: 'require(\'source-map-support\').install();require(\'isomorphic-fetch\');',
  raw: true,
  entryOnly: false,
};
export const clientPlugins = [
  new DefinePlugin(definePluginClientOpts),
  new HotModuleReplacementPlugin(),
  new NoEmitOnErrorsPlugin(),
  new NamedModulesPlugin(),
  new AssetsPlugin(assetsPluginOpts),
];
export const serverPlugins = [
  new DefinePlugin(definePluginServerOpts),
  new WriteFilePlugin(),
  new BannerPlugin(bannerPluginOpts),
];
