import path from 'path';
import fs from 'fs';

import Log from '../helpers/Log';

function resolveCustomConfiguration() {
  const packageJSON = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json')));

  if (packageJSON.felfire) return packageJSON.felfire;

  Log.info('No custom configuration. Using default options.');

  return {};
}

function resolveFilesToCopy(mode, configFromFile) {
  const defaultFilesToCopy = [
    {
      source: './sitemap.xml',
      destination: './sitemap.xml',
    },
    {
      source: './robots.txt',
      destination: './robots.txt',
    },
    {
      source: './favicon.ico',
      destination: './favicon.ico',
    },
  ];

  let filesToCopy = configFromFile.filesToCopy || [];

  if (mode !== 'server') filesToCopy = defaultFilesToCopy.concat(filesToCopy);

  return filesToCopy;
}

const computedPath = path.resolve(__dirname, '../package.json');
const { version: compilerVersion } = JSON.parse(fs.readFileSync(computedPath));
const configFromFile = resolveCustomConfiguration();
const defaultLocales = configFromFile.mode === 'static' ? ['en'] : [];
const mode = configFromFile.mode || 'server';

export default {
  compilerVersion,
  proxyPort: configFromFile.proxyPort || 3001,
  buildDir: configFromFile.buildDir || './build',
  sourceDir: configFromFile.sourceDir || './src',
  cacheDir: configFromFile.cacheDir || './.cache',
  plugins: configFromFile.plugins || [],
  openOnStart: configFromFile.openOnStart || false,
  autoprefixerBrowsers: configFromFile.autoprefixerBrowsers || [
    'Android 2.3',
    'Android >= 4',
    'Chrome >= 35',
    'Firefox >= 31',
    'Explorer >= 9',
    'iOS >= 7',
    'Opera >= 12',
    'Safari >= 7.1',
  ],
  cdnEndpoint: configFromFile.cdnEndpoint || '/',
  mode,
  locales: configFromFile.locales || defaultLocales,
  stats: configFromFile.stats || 'errors-only',
  filesToCopy: resolveFilesToCopy(mode, configFromFile),
  environment: configFromFile.environment || {},
};
