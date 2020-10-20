import Rules from './Rules';
import Plugins from './Plugins';
import BaseConfig from '../development/Config';

export default {
  context: BaseConfig.context,
  target: BaseConfig.target,
  externals: BaseConfig.externals,
  entry: BaseConfig.entry,
  output: BaseConfig.output,
  module: {
    noParse: BaseConfig.module.noParse,
    rules: Rules,
  },
  stats: BaseConfig.stats,
  plugins: Plugins,
  resolve: {
    modules: BaseConfig.resolve.modules,
    extensions: BaseConfig.resolve.extensions,
  },
};
