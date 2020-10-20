import webpack from 'webpack';
import BrowserSync from 'browser-sync';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import run from '@nicolascava/felfire-run';

import copy from './copy';
import clean from './clean';
import runServer from '../helpers/runServer';
import Config from '../config/Base';
import Log from '../helpers/Log';

let forwardedResolve = null;
let isInit = false;
let handleServerBundleComplete = null;

function handleSIGINT(browserSyncInstance) {
  return () => {
    forwardedResolve();
    process.exit();
    browserSyncInstance.exit();
  };
}

function handleRunServerResponse(runServerOpts) {
  return (error, host) => {
    const { webpackMiddlewareInstance, bundler } = runServerOpts;
    const browserSyncInstance = BrowserSync.create();
    const browserSyncOpts = {
      ui: {
        port: Config.proxyPort + 1,
      },
      open: Config.openOnStart,
      port: Config.proxyPort,
      cors: true,
      proxy: {
        target: host,
        middleware: [webpackMiddlewareInstance, webpackHotMiddleware(bundler)],
      },
      files: [],
    };

    if (error) return Log.error(error);

    browserSyncInstance.init(browserSyncOpts);

    handleServerBundleComplete = runServer(runServerOpts);
    isInit = true;

    return process.on('SIGINT', handleSIGINT(browserSyncInstance));
  };
}

function handleWatchError(error) {
  if (error) return Log.error(error);

  return error;
}

function handleWebpackDoneEvent(handleServerBundleCompleteOpts) {
  return () => {
    if (isInit) return handleServerBundleComplete();

    return handleServerBundleComplete(handleServerBundleCompleteOpts);
  };
}

function compileWithDefaultSettings({ webpackConfig, bundler }, resolve) {
  const webpackServerOpts = {
    stats: webpackConfig.stats,
  };
  const webpackOpts = {
    publicPath: Config.mode === 'server' ?
      webpackConfig.output.publicPath : webpackConfig[0].output.publicPath,
    stats: Config.mode === 'server' ?
      webpackConfig.stats : webpackConfig[0].stats,
  };
  const handleWebpackDoneEventOpts = { webpackConfig, bundler };

  handleWebpackDoneEventOpts.webpackMiddlewareInstance = Config.mode === 'server' ?
    webpackDevMiddleware(bundler, webpackServerOpts) :
    webpackDevMiddleware(bundler, webpackOpts);
  forwardedResolve = resolve;

  return bundler.plugin('done', handleWebpackDoneEvent(handleWebpackDoneEventOpts));
}

function compile(proxy, webpackConfig) {
  return new Promise((resolve) => {
    const bundler = webpack(webpackConfig);
    const watchOpts = {};
    const compileWithDefaultSettingsOpts = { webpackConfig, bundler };

    if (proxy) return compileWithDefaultSettings(compileWithDefaultSettingsOpts, resolve);

    return bundler.watch(watchOpts, handleWatchError);
  });
}

/**
 * Run a development server then watch for files changes using live-reload and HMR
 *
 * @param {Object} webpackConfig
 * @param {Boolean} proxy
 * @returns {Promise}
 */
export default async function ({ webpackConfig, proxy = true }) {
  await run(clean);
  await run(copy);

  return compile(proxy, webpackConfig);
}

/**
 * Run BrowserSync on first-run then restart the server when there is a file changes
 *
 * @param {Object} runServerOpts
 */
handleServerBundleComplete = (runServerOpts = null) => {
  const runServerResponse = runServer(runServerOpts);

  return runServerResponse(handleRunServerResponse(runServerOpts, handleServerBundleComplete));
};
