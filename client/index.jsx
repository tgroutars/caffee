import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import Root from './containers/Root';
import { store, history } from './store';

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" component={Root} />
        </Switch>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  );
};

render();

if (module.hot) {
  module.hot.accept(render);
}
