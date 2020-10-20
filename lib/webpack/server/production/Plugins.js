import { DefinePlugin, BannerPlugin, optimize } from 'webpack';

import Config from '../../../config/Base';

export default [
  new DefinePlugin({
    felfire: {
      config: JSON.stringify(Config),
    },
  }),
  new optimize.UglifyJsPlugin({
    comments: false,
    mangle: false,
  }),
  new BannerPlugin({
    banner: 'require(\'isomorphic-fetch\');',
    raw: true,
    entryOnly: false,
  }),
];
