import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter as Router } from 'react-router';
import createHistory from 'history/createMemoryHistory';
import { Provider } from 'react-redux';
import path from 'path';
import fs from 'fs-extra';
import createStore from '@nicolascava/redux-create-store';
import { DynamicHTTPClient as BFFClient } from '@nicolascava/http-client';

/* eslint-disable import/no-unresolved, import/extensions */

import Root from 'root-component-alias';
import Website from 'website-container-alias';
import { initialState } from 'website-reducer-alias';
import reducer from 'reducers-alias';

/* eslint-enable import/no-unresolved, import/extensions */

export default function (locals) {
  const bffClientOpts = {
    url: null,
  };
  const storeOpts = {
    website: initialState,
  };
  const client = new BFFClient(bffClientOpts);
  const memoryHistory = createHistory(locals.path);
  const newStore = createStore(reducer, null);
  const webpackAssetsPath = path.join(
    process.cwd(),
    felfire.config.buildDir,
    felfire.config.locale,
    './webpack-assets.json',
  );
  const assets = JSON.parse(fs.readFileSync(webpackAssetsPath));
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36';
  const store = newStore(memoryHistory, client, storeOpts);
  const context = {};
  const component = (
    <Provider store={store} key="provider">
      <Router context={context} location={locals.path}>
        <Website history={memoryHistory} />
      </Router>
    </Provider>
  );

  global.navigator = { userAgent };

  const computedComponent = (
    <Root assets={assets} component={component} userAgent={userAgent} store={store} />
  );

  return `<!DOCTYPE html>${ReactDOMServer.renderToString(computedComponent)}`;
}
