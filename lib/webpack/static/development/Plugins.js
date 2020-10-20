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

const definePluginOpts = {
  felfire: {
    config: JSON.stringify(Config),
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
  new DefinePlugin(definePluginOpts),
  new HotModuleReplacementPlugin(),
  new NoEmitOnErrorsPlugin(),
  new NamedModulesPlugin(),
  new AssetsPlugin(assetsPluginOpts),
];
export const serverPlugins = [
  new DefinePlugin(definePluginOpts),
  new WriteFilePlugin(),
  new BannerPlugin(bannerPluginOpts),
];
