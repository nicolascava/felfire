import path from 'path';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import Config from '../../../config/Base';
import packageJSON from '../../../../package.json';

const include = path.join(__dirname, '../../../..');
const baseRules = [
  {
    test: /\.(png|jpg|gif|svg|woff|woff2)$/,
    include,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name]-[hash].[ext]',
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          progressive: true,
          optipng: {
            optimizationLevel: 7,
          },
          gifsicle: {
            interlaced: false,
          },
          pngquant: {
            quality: '65-90',
            speed: 4,
          },
        },
      },
    ],
  },
  {
    test: /\.(png|jpg|gif|svg|woff|woff2)(\?noencode)?$/,
    include,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[path][name]-[hash].[ext]',
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          progressive: true,
          optipng: {
            optimizationLevel: 7,
          },
          gifsicle: {
            interlaced: false,
          },
          pngquant: {
            quality: '65-90',
            speed: 4,
          },
        },
      },
    ],
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
        options: packageJSON.babelRC,
      },
      'ts-loader',
    ],
  },
  {
    test: /\.js$/,
    include,
    loader: 'babel-loader',
    options: packageJSON.babelRC,
  },
  {
    test: /vendors\.scss$/,
    include,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [autoprefixer({
              browsers: Config.autoprefixerBrowsers,
            })],
          },
        },
        {
          loader: 'sass-loader',
          options: {
            outputStyle: 'expanded',
          },
        },
      ],
    }),
  },
  {
    test: /^(?!.*vendors\.scss$).*\.scss$/,
    include,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
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
          },
        },
        {
          loader: 'sass-loader',
          options: {
            outputStyle: 'expanded',
          },
        },
      ],
    }),
  },
]);
export const serverRules = baseRules.concat([
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
  {
    test: /\.js$/,
    include,
    loader: 'babel-loader',
    options: packageJSON.babelRC,
  },
  {
    test: /vendors\.scss$/,
    include,
    use: [
      {
        loader: 'css-loader/locals',
        options: {
          importLoaders: 1,
          localIdentName: '_[local]_[hash:base64:5]',
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
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
          localIdentName: '_[local]_[hash:base64:5]',
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
        },
      },
    ],
  },
]);
