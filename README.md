# Felfire

> One bolt of powerful magic to improves your development workflow

> ❌ Sorry, but this library is no longer maintained. Please find an alternative.

## Getting started

### Run local configuration

```bash
felfire start
```

Felfire compiles sources into `buildDir`, then it starts a Node server in watch mode using this compiled source. File changes would trigger a sources recompilation and server restart.

It also runs a proxy, in order to share your website in development to any coworkers within your local network.

### Run distribution compilation

```bash
felfire build
```

Felfire will compile sources into the build directory as well. In addition, it will perform many optimization to turn the app distribution-ready. You can just now take the content of the build directory, deploy it, and you're in business.

## Philosophy

* **One dependency**: there is just one dependency. It provides a cohesive curated experience on top of powerful Open Source tools.
* **Zero configuration**: there are no configuration files or command line options. Configuring both local and distribution builds is handled for you so you can focus on writing code. You can however use custom options to amplify your experience.
* **Extensible**: with the powerful Felfire plugins system, you can plug your custom library to the compiler to extend the final Felfire capacities (e.q. a deployment plugin to Google App Engine).
* **Mutable**: Felfire can mute into three states to support websites, web apps, and servers, on demand.

## Why Felfire?

Every modern JavaScript environment today uses a compiler. That's can be only a Babel, Gulp, or even Webpack stack.

To materialize compilation intelligence in order to improve developer experience, Felfire was built.

## Modes

Felfire comes with three modes that support three types of software: websites, web apps, and servers.
Each type needs different architecture and compiler behaviour.

See the corresponding documentation about [Felfire's modes](./docs/modes.md).

## Commands

```bash
# Runs the development compilation
felfire start [--env-file=.env] [--no-proxy] [--key=my-key]

# Runs the distribution compilation
felfire build [--env-file=.env] [--key=my-key]

# Encrypt the `./.env.plain` file to the `./.env.encrypted`
# Encrypted environment file can be read by Felfire with the `--key` argument
felfire encrypt [--key=my-key]

# Extract app's local and external dependencies into `./dependencies-map.json`
felfire extract
```

### Options

* `--env-file`: specify an environment file to inject environment variables into Felfire and the product (e.q. `--env-file=.env`).
* `--no-proxy`: tells Felfire to not use his proxy for development purpose.
* `--key`: specify a key for decrypt the encrypted environment file.

### Features

#### Modules resolution

Felfire resolves modules the same way that Node resolves the `node_modules` directory. It has 2 levels of resolution, in the following order:

* `node_modules` directory at the repository root.
* `src` directory, for application's sources.

This feature provides clear imports segmentation:

```javascript
// External module
import { withRouter, Route, Switch } from 'react-router-dom';

// App module
import Config from './config';
```

### Environment files

Felfire resolves environment variables on runtime, but this behaviour changes relative to the mode.

In **universal** and **static** modes, Felfire resolves environment variables in development and distribution builds.
In **default** mode, Felfire only does it on development build.

An example of environment file:

```
API_ENDPOINT=https://api.mydomain.com
ENVIRONMENT=staging
```

By default, Felfire looks for a `.env` file into the root, but it will ignore resolution if there is no environment file. You can specify it when running a command with the `--env-file` argument.

Environment files is used to replace `process.env` object values into the source code:

```javascript
// https://api.mydomain.com
const apiEndpoint = process.env.API_ENDPOINT;
```

In **default** mode, Felfire doesn't resolve environment variables on distribution builds.

## Custom configuration

Felfire uses a default configuration but you can override it by using a `felfire` key into the `package.json` (by default) or by a `.felfirerc`'s file into the root.

Here are the full options explained:

```json
{
  "port": 3000,
  "buildDir": "./build",
  "sourceDir": "./src",
  "cacheDir": "./.cache",
  "openOnStart": false,
  "locales": ["en"],
  "autoprefixerBrowsers": [
    "Android 2.3",
    "Android >= 4",
    "Chrome >= 35",
    "Firefox >= 31",
    "Explorer >= 9",
    "iOS >= 7",
    "Opera >= 12",
    "Safari >= 7.1"
  ],
  "filesToCopy": [
    {
      "source": "./sitemap.xml",
      "destination": "./sitemap.xml"
    },
    {
      "source": "./robots.txt",
      "destination": "./robots.txt"
    },
    {
      "source": "./favicon.ico",
      "destination": "./favicon.ico"
    }
  ],
  "cdnEndpoint": "/",
  "mode": "server",
  "locales": ["en"],
  "stats":  {
    "colors": true,
    "hash": false,
    "version": false,
    "timings": false,
    "assets": false,
    "chunks": false,
    "modules": false,
    "reasons": false,
    "children": false,
    "source": false,
    "errors": false,
    "errorDetails": false,
    "warnings": false,
    "publicPath": false
  },
  "plugins": []
}
```

Also, Felfire injects its configuration into the global scope as `felfire`. Example:

```javascript
const { buildDir } = felfire.config;
```

## Plugins

### Mandatory criterions

Felfire authorizes plugins to extend its capacities. Plugins need to follow a specific nomenclature to be recognized: they needs to be prefixed by `felfire-` (e.q. `felfire-aws-s3`).

### Plugin architecture

A plugin architecture needs to export a default function on its main module, then Felfire will inject some parameters to expend the plugin capacities. Example:

```javascript
export default function ({ compiler, commander }) {}
```

There are two parameters injected:
* `compiler`, corresponds to the Felfire instance. It contains a log function and the full Felfire configuration.
* `commander`, corresponds to the Commander instance. [Commander](https://github.com/tj/commander.js) is used by Felfire to provide a clear interface for its commands.

### Using custom arguments into a plugin

You can use custom arguments into a plugin by exporting a function named `init`.

AWS S3 plugin example:

```javascript
export function init(commander) {
  commander.option('--env <env>', 'the AWS S3 environment that Felfire must deploys to');

  return commander;
}
```

`commander` is the instance of Felfire's interface. Specifying an option property permits to use argument with the plugin command (e.q. `felfire aws-s3 --env=staging`).

Finally, retrieve your argument value using the `commander` instance on your default exported function:

```javascript
const args = _.find(commander.commands, command => command._name === 'aws-s3');
const env = args.env;
```

`aws-s3` is the `felfire-aws-s3` suffix in this context.

## Felfire plugin's ecosystem

* [felfire-aws-elastic-beanstalk](https://github.com/nicolascava/felfire-aws-elastic-beanstalk)
* [felfire-aws-s3](https://github.com/nicolascava/felfire-aws-s3)
* [felfire-google-app-engine](https://github.com/nicolascava/felfire-google-app-engine)
* [felfire-google-cloud-storage](https://github.com/nicolascava/felfire-google-cloud-storage)

## Thanks to
 
Blizzard, and Warcraft, for the entire inspiration on the Felfire's name!

Felfire is a [corrupted magic in the Warcraft universe](http://wow.gamepedia.com/Felfire).

## License

The MIT License (MIT)

Copyright (c) 2018 Nicolas Cava

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
