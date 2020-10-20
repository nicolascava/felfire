import path from 'path';
import _ from 'lodash';

import Config from '../config/Base';
import packageJSON from '../../package.json';

export default function () {
  const babelRC = packageJSON.babel;
  const reactTransformOpts = {
    transforms: [
      {
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module'],
      },
      {
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react'],
      },
    ],
  };
  const unshiftES2015Opts = {
    modules: false,
  };

  babelRC.cacheDirectory = path.resolve(process.cwd(), Config.cacheDir);

  const clientBabelRC = _.cloneDeep(babelRC);

  clientBabelRC.plugins = clientBabelRC.plugins || [];
  clientBabelRC.presets = clientBabelRC.presets || [];
  clientBabelRC.plugins.push(['react-hot-loader/babel']);
  clientBabelRC.plugins.push(['react-transform', reactTransformOpts]);

  const es2015Index = clientBabelRC.presets.indexOf('es2015');

  if (es2015Index !== -1) clientBabelRC.presets.splice(es2015Index, 1);

  clientBabelRC.presets.push('react-hmre');
  clientBabelRC.presets.unshift(['es2015', unshiftES2015Opts]);

  return { babelRC, clientBabelRC };
}
