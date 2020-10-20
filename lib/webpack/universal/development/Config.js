import path from 'path';
import nodeExternals from 'webpack-node-externals';

import Config from '../../../config/Base';
import { clientRules, serverRules } from './Rules';
import { clientPlugins, serverPlugins } from './Plugins';

const nodeExternalsOpts = {
  modulesDir: path.resolve(__dirname, '../../../../../node_modules'),
};
const clientConfig = {
  stats: Config.stats,
  cache: true,
  target: 'web',
  name: 'client',
  output: {
    path: path.resolve(process.cwd(), Config.buildDir),
    publicPath: '/build/',
    chunkFilename: '[name]-[chunkhash].js',
    filename: '[name]-[hash].js',
  },
  devtool: 'cheap-module-eval-source-map',
  context: path.join(process.cwd(), Config.sourceDir),
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    rules: clientRules,
  },
  resolve: {
    unsafeCache: true,
    modules: [
      'node_modules',
      path.resolve(__dirname, '../../../../..'),
      path.resolve(process.cwd(), Config.sourceDir),
    ],
    extensions: ['.ts', '.tsx', '.js'],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  entry: {
    app: [
      'webpack-hot-middleware/client?name=client&overlay=false&reload',
      'react-hot-loader/patch',
      path.join(process.cwd(), Config.sourceDir, './client.js'),
    ],
    async: [
      'webpack-hot-middleware/client?name=client&overlay=false&reload',
      'react-hot-loader/patch',
      path.join(process.cwd(), Config.sourceDir, './async.js'),
    ],
  },
  plugins: clientPlugins,
};
const serverConfig = {
  cache: clientConfig.cache,
  resolve: clientConfig.resolve,
  stats: clientConfig.stats,
  context: clientConfig.context,
  name: 'server',
  target: 'node',
  devtool: 'inline-source-map',
  externals: [nodeExternals(nodeExternalsOpts)],
  entry: path.resolve(process.cwd(), Config.sourceDir),
  output: {
    path: clientConfig.output.path,
    publicPath: clientConfig.output.publicPath,
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    noParse: clientConfig.module.noParse,
    rules: serverRules,
  },
  plugins: serverPlugins,
};

export default [clientConfig, serverConfig];
