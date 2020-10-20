import path from 'path';
import fs from 'fs-extra';

import Config from '../config/Base';

function copyFile(file) {
  fs.copySync(
    path.join(process.cwd(), Config.sourceDir, file.source),
    path.join(process.cwd(), Config.buildDir, file.destination),
  );
}

function copyFileWithLocale(locale) {
  return file =>
    fs.copySync(
      path.join(process.cwd(), Config.sourceDir, file.source),
      path.join(process.cwd(), Config.buildDir, locale, file.destination),
    );
}

function resolveLocale(locale) {
  return Config.filesToCopy.forEach(copyFileWithLocale(locale));
}

/**
 * Copy sources to the build directory
 *
 * @param {Boolean} isBuild
 * @returns {Promise}
 */
export default async function ({ isBuild = false }) {
  if (Config.filesToCopy) {
    if (isBuild && Config.locales && Config.locales.length > 0) {
      return Config.locales.forEach(resolveLocale);
    }

    return Config.filesToCopy.forEach(copyFile);
  }

  return null;
}
