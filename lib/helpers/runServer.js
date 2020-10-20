import path from 'path';
import cp from 'child_process';

import Config from '../config/Base';

let callbackIsPending = false;
let server = null;

/**
 * Handle server exit
 */
function handleExit() {
  if (server) return server.kill('SIGTERM');

  return null;
}

/**
 * Handle server exit if callback is pending
 *
 * @param {String} code
 * @param {String} signal
 */
function handleExitIfCallbackIsPending(code, signal) {
  if (callbackIsPending) {
    throw new Error(`Server terminated unexpectedly with code ${code} and signal ${signal}.`);
  }
}

function handleStdoutWrite(data) {
  return process.stdout.write(data);
}

/**
 * Callback on message when the server is running
 *
 * @param {Function} done
 * @returns {Function}
 */
function onStdOut(done) {
  return (data) => {
    const runningRegExp = /Server is running at http:\/\/(.*?)\./;
    const match = data.toString('utf8').match(runningRegExp);

    process.stdout.write(data);

    if (match) {
      server.stdout.removeAllListeners('data');
      server.stdout.on('data', handleStdoutWrite);
    }

    if (done) {
      callbackIsPending = false;

      return done(null, match[1]);
    }

    return null;
  };
}

function handleStderr(error) {
  return process.stderr.write(error);
}

/**
 * Handle server run
 *
 * @param {String} serverPath
 * @returns {Function}
 */
function handleServerRun({ serverPath }) {
  return (done) => {
    const opts = {
      silent: false,
      cwd: path.resolve(process.cwd(), Config.buildDir),
    };

    if (server) server.kill('SIGTERM');

    server = cp.spawn('node', [serverPath], opts);

    if (callbackIsPending) server.once('exit', handleExitIfCallbackIsPending);

    server.stdout.on('data', onStdOut(done));
    server.stderr.on('data', handleStderr);
    process.on('exit', handleExit);

    return server;
  };
}

/**
 * Run server into a child process
 *
 * @param {Object} webpackConfig
 * @returns {Function}
 */
export default function ({ webpackConfig }) {
  const serverPath = Config.mode === 'server' ?
    path.resolve(webpackConfig.output.path, webpackConfig.output.filename) :
    path.resolve(webpackConfig[1].output.path, webpackConfig[1].output.filename);
  const handleServerRunOpts = { serverPath, config: Config };

  return handleServerRun(handleServerRunOpts);
}
