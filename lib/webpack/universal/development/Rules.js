import path from 'path';
import autoprefixer from 'autoprefixer';

import Config from '../../../config/Base';
import resolveBabelRC from '../../../helpers/resolveBabelRC';

const { clientBabelRC, babelRC } = resolveBabelRC();
const include = path.resolve(__dirname, '../../../..');
export const baseRules = [
  {
    test: /\.(png|jpg|gif|svg|woff|woff2)$/,
    include,
    loader: 'file-loader',
    options: {
      name: '[path][name].[ext]',
    },
  },
  {
    test: /\.xml$/,
    include,
    loader: 'raw-loader',
  },
  {
    test: /\.yml$/,
    include,
    use: ['json-loader', 'yaml-loader'],
  },
  {
    test: /\.ts$/,
    include,
    loader: 'ts-loader',
  },
];
export const clientRules = baseRules.concat([
  {
    test: /\.tsx/,
    include,
    use: [
      {
        loader: 'babel-loader',
        options: clientBabelRC,
      },
      'ts-loader',
    ],
  },
  {
    test: /\.js$/,
    include,
    loader: 'babel-loader',
    options: clientBabelRC,
  },
  {
    test: /vendors\.scss$/,
    include,
    use: [
      {
        loader: 'style-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: () => [autoprefixer({
            browsers: Config.autoprefixerBrowsers,
          })],
          sourceMap: true,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
        },
      },
    ],
  },
  {
    test: /^(?!.*vendors\.scss$).*\.scss$/,
    include,
    use: [
      {
        loader: 'style-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          sourceMap: true,
          localIdentName: '_[local]_[hash:base64:5]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: () => [autoprefixer({
            browsers: Config.autoprefixerBrowsers,
          })],
          sourceMap: true,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
        },
      },
    ],
  },
]);
export const serverRules = baseRules.concat([
  {
    test: /\.tsx/,
    include,
    use: [
      {
        loader: 'babel-loader',
        options: babelRC,
      },
      'ts-loader',
    ],
  },
  {
    test: /\.js$/,
    include,
    loader: 'babel-loader',
    options: babelRC,
  },
  {
    test: /vendors\.scss$/,
    include,
    use: [
      {
        loader: 'css-loader/locals',
        options: {
          importLoaders: 1,
          sourceMap: true,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
        },
      },
    ],
  },
  {
    test: /^(?!.*vendors\.scss$).*\.scss$/,
    include,
    use: [
      {
        loader: 'css-loader/locals',
        options: {
          modules: true,
          importLoaders: 1,
          sourceMap: true,
          localIdentName: '_[local]_[hash:base64:5]',
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
        },
      },
    ],
  },
]);
