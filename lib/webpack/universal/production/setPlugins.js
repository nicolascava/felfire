import { DefinePlugin, NoEmitOnErrorsPlugin, BannerPlugin, optimize } from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import Config from '../../../config/Base';

function resolveNormalizedEnv(environment) {
  const keys = Object.keys(Config.environment[environment]);

  return keys.reduce((accumulation, current) => ({
    ...accumulation,
    [current]: JSON.stringify(Config.environment[environment][current]),
  }), {});
}

function setPlugins(environment) {
  let normalizedEnv = {};

  if (Config.environment[environment]) normalizedEnv = resolveNormalizedEnv(environment);

  const felfirePlugin = {
    config: JSON.stringify(Config),
  };
  const uglifyOpts = {
    comments: false,
  };
  const definePluginClientOpts = {
    felfire: felfirePlugin,
    'process.env': {
      ...normalizedEnv,
      IS_CLIENT: JSON.stringify(true),
      IS_SERVER: JSON.stringify(false),
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
  const extractTextPluginOpts = {
    filename: 'app-[chunkhash].css',
    disable: false,
    allChunks: true,
  };
  const assetsPlugin = {
    path: path.join(process.cwd(), Config.buildDir),
  };
  const bannerPluginOpts = {
    banner: 'require(\'isomorphic-fetch\');',
    raw: true,
    entryOnly: false,
  };
  const clientPlugins = [
    new optimize.UglifyJsPlugin(uglifyOpts),
    new DefinePlugin(definePluginClientOpts),
    new NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin(extractTextPluginOpts),
    new AssetsPlugin(assetsPlugin),
  ];
  const serverPlugins = [
    new optimize.UglifyJsPlugin(uglifyOpts),
    new DefinePlugin(definePluginServerOpts),
    new BannerPlugin(bannerPluginOpts),
  ];

  return { clientPlugins, serverPlugins };
}

export default setPlugins;
