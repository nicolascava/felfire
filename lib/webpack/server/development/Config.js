import path from 'path';
import nodeExternals from 'webpack-node-externals';

import Config from '../../../config/Base';
import Rules from './Rules';
import Plugins from './Plugins';

const nodeExternalsOpts = {
  modulesDir: path.resolve(__dirname, '../../../../../node_modules'),
};

export default {
  context: path.join(process.cwd(), Config.sourceDir),
  target: 'node',
  devtool: 'inline-source-map',
  cache: true,
  externals: [nodeExternals(nodeExternalsOpts)],
  entry: path.join(process.cwd(), Config.sourceDir),
  output: {
    publicPath: '/',
    path: path.join(process.cwd(), Config.buildDir),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    rules: Rules,
  },
  stats: Config.stats,
  plugins: Plugins,
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../../../../..'),
      path.resolve(process.cwd(), Config.sourceDir),
    ],
    unsafeCache: true,
    extensions: ['.ts', '.tsx', '.js'],
  },
};
