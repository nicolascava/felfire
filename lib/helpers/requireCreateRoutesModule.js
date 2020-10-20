import path from 'path';
import hook from 'css-modules-require-hook';

import Config from '../config/Base';

function handleIgnoredExtensions(ignoreExtension) {
  require.extensions[ignoreExtension] = () => true;
}

function handleRoutes(paths) {
  return (route) => {
    if (route.path) return paths.push(route.path);

    return route;
  };
}

export default function () {
  const ignoredExtensions = ['.svg', '.png', '.jpg', '.md'];
  const hookOpts = {
    extensions: ['.css', '.scss'],
    generateScopedName: '_[local]_[hash:base64:5]',
  };
  const modulePath = path.join(process.cwd(), Config.sourceDir, './utils/routes');
  const paths = [];

  global.felfire = { config: Config };
  hook(hookOpts);
  ignoredExtensions.forEach(handleIgnoredExtensions);

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const routes = require(modulePath).default;

  routes.forEach(handleRoutes(paths));

  return paths;
}
