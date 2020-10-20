import recursive from 'recursive-readdir';
import path from 'path';
import fs from 'fs';
import { removeFileNameFromPath, getPosition } from '@nicolascava/helpers';

import packageJSON from '../../package.json';

const externalDependencies = [];
const resolvedFiles = [];
const resolveMatches = [];

function handleUnresolvedFile(file) {
  if (!fs.existsSync(`${file}.js`)) {
    if (!fs.existsSync(`${file}/index.js`)) return file;

    return `${file}/index.js`;
  }

  return `${file}.js`;
}

async function extractFromFile(file) {
  const handleMatch = async (matches, regex, mutableFile) => {
    const mutableRegex = regex;

    if (matches.index === mutableRegex.lastIndex) mutableRegex.lastIndex += 1;

    const match = matches[1] || matches[2] || matches[3];

    if (match && resolveMatches.indexOf(match) === -1) {
      let externalDependency = null;

      if (match.indexOf('/') > -1 && match.indexOf('@') !== 0) {
        externalDependency = match.slice(0, match.indexOf('/'));
      } else if (match.indexOf('@') === 0) {
        const secondSlashIndex = getPosition(match, '/', 2);

        externalDependency = match.slice(0, secondSlashIndex);
      } else {
        externalDependency = match;
      }

      let dependencyPath = null;

      resolveMatches.push(match);

      if (
        externalDependencies.indexOf(externalDependency) === -1 &&
        packageJSON.dependencies[externalDependency]
      ) {
        return externalDependencies.push(externalDependency);
      }

      const filePath = removeFileNameFromPath(mutableFile);
      const internalPackagePath = path.resolve(__dirname, '../../..', match);

      if (fs.existsSync(internalPackagePath)) {
        dependencyPath = internalPackagePath;
      } else if (fs.existsSync(`${internalPackagePath}.js`)) {
        dependencyPath = `${internalPackagePath}.js`;
      } else if (fs.existsSync(path.join(filePath, match))) {
        dependencyPath = path.join(filePath, match);
      } else {
        return mutableFile;
      }

      if (resolvedFiles.indexOf(dependencyPath) === -1) return extractFromFile(dependencyPath);
    }

    return mutableFile;
  };

  const regex = /.*?from '(.*?)'\.*?|.*?require\('(.*?)'\).*?|.*?require\("(.*?)"\).*?/gmi;

  let mutableFile = file;
  let matches = [];

  if (mutableFile.indexOf('.js') === -1 || !fs.existsSync(mutableFile)) {
    mutableFile = handleUnresolvedFile(mutableFile);
  }

  resolvedFiles.push(mutableFile);

  const content = fs.readFileSync(mutableFile, 'utf8');

  // eslint-disable-next-line no-cond-assign
  while (matches = regex.exec(content)) {
    handleMatch(matches, regex, mutableFile).then();
  }

  return mutableFile;
}

async function handleFile(file) {
  return extractFromFile(file);
}

function handleShadowDependencies(dependency) {
  if (dependency.indexOf('graphql-') > -1 && externalDependencies.indexOf('graphql') === -1) {
    externalDependencies.push('graphql');
  }

  if (dependency.indexOf('knex') > -1 && externalDependencies.indexOf('mysql') === -1) {
    externalDependencies.push('mysql');
  }

  if (
    dependency.indexOf('react-collapse') > -1 &&
    externalDependencies.indexOf('react-motion') === -1
  ) {
    externalDependencies.push('react-motion');
  }
}

function handleSearchResponse(noFile, resolve) {
  return async (error, files) => {
    const dependencyMapFilePath = path.join(process.cwd(), './dependency-map.json');

    await Promise.all(files.map(handleFile));

    externalDependencies.forEach(handleShadowDependencies);

    const fileToWrite = JSON.stringify(externalDependencies);

    if (!noFile) fs.writeFileSync(dependencyMapFilePath, fileToWrite);

    return resolve(externalDependencies);
  };
}

export default async function ({ sourceDir, noFile = false, onlyIndex = false }) {
  return new Promise((resolve) => {
    const searchPath = path.join(process.cwd(), sourceDir);
    const ignoredExtensions = onlyIndex ? ['!index.js'] : ['!*.js'];

    return recursive(searchPath, ignoredExtensions, handleSearchResponse(noFile, resolve));
  });
}
