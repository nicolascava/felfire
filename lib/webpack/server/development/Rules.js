import path from 'path';

import Config from '../../../config/Base';
import packageJSON from '../../../../package.json';

const include = path.join(__dirname, '../../../..');

packageJSON.babelRC.cacheDirectory = path.join(process.cwd(), Config.cacheDir);

export default [
  {
    test: /\.js$/,
    include,
    loader: 'babel-loader',
    options: packageJSON.babelRC,
  },
  {
    test: /\.html$/,
    include,
    loader: 'html-loader',
  },
  {
    test: /\.txt/,
    include,
    loader: 'raw-loader',
  },
  {
    test: /\.csv/,
    include,
    loader: 'dsv-loader',
  },
  {
    test: /\.ts$/,
    include,
    loader: 'ts-loader',
  },
  {
    test: /\.tsx/,
    include,
    use: [
      {
        loader: 'babel-loader',
        options: packageJSON.babelRC,
      },
      'ts-loader',
    ],
  },
];
