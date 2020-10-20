# Modes

Felfire needs specific architectures in order to work efficiently. Each behaviour has their specifics:
 
* **Default**: downstream services, APIs, etc.
* **Universal**: universal JavaScript web apps.
* **Static**: static websites.

Please note that in default and universal modes, your server needs to `stdout` a precise string with the server port:

```javascript
console.log('Server is running at http://localhost:4000.');
```

Please do not change the string structure, just copy paste it. `console.log` is just for the example, any logging client is ok (in theory).

## Default mode (server mode)

By default, Felfire is on server mode (e.q. downstream services, APIs), it only bundles server-side sources.

This mode is efficient for every Node.js server (but not universal JavaScript apps). You need to follow a specific architecture that Felfire understand:

```
package.json
.env                    // .env*'s files are optional
.env.development
.env.staging
.env.encrypted
src                     // Can be changed by the option `sourceDir`
└── index.js
```

Felfire will use `index.js` as an entry point to bundle your server.

## Universal mode

Felfire has an universal mode (e.q. universal JavaScript web apps), it bundles server-side and client-side sources.

You need to follow a specific architecture that Felfire understand:

```
package.json
.env                    // .env*'s files are optional
.env.development
.env.staging
.env.encrypted
src                     // Can be changed by the option `sourceDir`
├── client.js           // Sync client entry point
├── async.js            // Async client entry point
├── favicon.ico         // Can be changed by the option `filesToCopy`
├── robots.txt          // Can be changed by the option `filesToCopy`
├── sitemap.xml         // Can be changed by the option `filesToCopy`
└── index.js            // Server entry point
```

Felfire will use `index.js` as an entry point to bundle your server, `client.js` and `async.js` to bundle your client sources.
 
`client.js` represents the sync part of your client sources (usually put before the closing body tag). Here you do the render of your React client-side app.

`async.js` represents the async part of your client sources (usually put in the head tag, with async attributes). Here you put scripts like Google Analytics initialization.

`index.js` represents the server-side of your app. Here you render with the React server-side app.

## Static mode

Felfire has a static mode (e.q. static websites), it bundles client-side sources only (obviously).

You need to follow a specific architecture that Felfire understand:

```
package.json
.env                    // .env*'s files are optional
.env.development
.env.staging
.env.encrypted
src                     // Can be changed by the option `sourceDir`
├── client.js           // Sync entry point
├── async.js            // Async entry point
├── favicon.ico         // Can be changed by the option `filesToCopy`
├── robots.txt          // Can be changed by the option `filesToCopy`
└── sitemap.xml         // Can be changed by the option `filesToCopy`
```

Felfire will use `client.js` and `async.js` to bundle your sources.
 
`client.js` represents the sync part of your sources (usually put before the closing body tag). Here you do the render with React.

`async.js` represents the async part of your sources (usually put in the head tag, with async attributes). Here you put scripts like Google Analytics initialization.
