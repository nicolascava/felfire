import { DefinePlugin, BannerPlugin } from 'webpack';
import WriteFilePlugin from 'write-file-webpack-plugin';

import Config from '../../../config/Base';

export default [
  new DefinePlugin({
    felfire: {
      config: JSON.stringify(Config),
    },
  }),
  new WriteFilePlugin(),
  new BannerPlugin({
    banner: 'require(\'source-map-support\').install();require(\'isomorphic-fetch\');',
    raw: true,
    entryOnly: false,
  }),
];
