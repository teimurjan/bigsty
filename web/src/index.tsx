import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'bulma/css/bulma.css';

import { ConnectedApp } from 'src/ConnectedApp';
import { unregister } from 'src/registerServiceWorker';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    collapseGroups: true,
  });
}

const render = process.env.REACT_APP_USE_HYDRATE ? ReactDOM.render : ReactDOM.hydrate;

render(<ConnectedApp />, document.getElementById('root') as HTMLElement);

unregister();
