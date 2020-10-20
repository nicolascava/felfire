import rimraf from 'rimraf';
import path from 'path';

import Config from '../config/Base';

/**
 * Clean directories
 *
 * @returns {Promise}
 */
export default async function () {
  const directories = [
    path.join(process.cwd(), Config.cacheDir),
    path.join(process.cwd(), Config.buildDir),
  ];

  return directories.forEach(directory => rimraf.sync(directory, {}));
}
