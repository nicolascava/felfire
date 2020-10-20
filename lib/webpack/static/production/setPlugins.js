import { DefinePlugin, NoEmitOnErrorsPlugin, BannerPlugin, optimize } from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StaticSiteGeneratorPlugin from 'static-site-generator-webpack-plugin';

import Config from '../../../config/Base';
import requireCreateRoutesModule from '../../../helpers/requireCreateRoutesModule';

export default function (locale) {
  const paths = requireCreateRoutesModule();
  const uglifyOpts = {
    comments: false,
  };
  const definePluginOpts = {
    felfire: {
      config: JSON.stringify({ ...Config, locale }),
    },
  };
  const extractTextPluginOpts = {
    filename: 'app-[chunkhash].css',
    disable: false,
    allChunks: true,
  };
  const assetsPlugin = {
    path: path.join(process.cwd(), Config.buildDir, locale),
  };
  const bannerPluginOpts = {
    banner: 'require(\'isomorphic-fetch\');',
    raw: true,
    entryOnly: false,
  };
  const staticSiteGeneratorPluginOpts = {
    entry: 'app',
    paths,
  };
  const clientPlugins = [
    new optimize.UglifyJsPlugin(uglifyOpts),
    new DefinePlugin(definePluginOpts),
    new NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin(extractTextPluginOpts),
    new AssetsPlugin(assetsPlugin),
  ];
  const serverPlugins = [
    new optimize.UglifyJsPlugin(uglifyOpts),
    new DefinePlugin(definePluginOpts),
    new BannerPlugin(bannerPluginOpts),
    new StaticSiteGeneratorPlugin(staticSiteGeneratorPluginOpts),
  ];

  return { clientPlugins, serverPlugins };
}
