import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import run from '@nicolascava/felfire-run';

import Log from '../helpers/Log';
import copy from './copy';
import clean from './clean';
import Config from '../config/Base';
import setConfig from '../webpack/static/production/setConfig';
import extract from './extract';
import packageJSON from '../../package.json';

function handleReject(error) {
  return Log.error(error);
}

function handleWebpackResponse(resolve, reject) {
  return (error, stats) => {
    if (error) return reject(error);
    if (stats.hasErrors()) return reject(stats.toString(Config.stats));

    return resolve();
  };
}

function resolveExternalDependencies(distributedPackageJSON) {
  return (module) => {
    const mutableDistributedPackageJSON = distributedPackageJSON;

    if (module === 'graphql-tag') {
      mutableDistributedPackageJSON.dependencies.graphql = packageJSON.dependencies.graphql;
    }

    mutableDistributedPackageJSON.dependencies[module] = packageJSON.dependencies[module];
  };
}

function writeExternalDependencies(modules) {
  const buildPackageJSON = path.join(process.cwd(), Config.buildDir, './package.json');
  const distributedPackageJSON = {
    dependencies: {},
  };

  modules.forEach(resolveExternalDependencies(distributedPackageJSON));

  return fs.writeFileSync(buildPackageJSON, JSON.stringify(distributedPackageJSON));
}

function handleWebpackResponseThenExtract(resolve, reject) {
  return async (error, stats) => {
    const extractOpts = {
      sourceDir: Config.buildDir,
      noFile: true,
      onlyIndex: true,
    };

    if (error) return reject(error);
    if (stats.hasErrors()) return reject(stats.toString(Config.stats));

    const modules = await run(extract, extractOpts);

    if (modules.length > 0) writeExternalDependencies(modules);

    return resolve();
  };
}

function resolveLocale(typeIndex = 0) {
  return locale =>
    new Promise((resolve, reject) => {
      const updatedWebpackConfig = setConfig(locale);

      return webpack(updatedWebpackConfig[typeIndex], handleWebpackResponse(resolve, reject));
    });
}

function resolveLocales(typeIndex = 0) {
  return Config.locales.map(resolveLocale(typeIndex));
}

/**
 * Build production-ready sources
 *
 * @param {Object} webpackConfig
 * @returns {Promise}
 */
export default async function ({ webpackConfig }) {
  const copyOpts = {
    isBuild: true,
  };

  await run(clean);
  await run(copy, copyOpts);

  if (Config.mode === 'static') {
    await Promise.all(resolveLocales()).catch(handleReject);

    return Promise.all(resolveLocales(1)).catch(handleReject);
  }

  return new Promise((resolve, reject) =>
    webpack(webpackConfig, handleWebpackResponseThenExtract(resolve, reject)))
    .catch(handleReject);
}
