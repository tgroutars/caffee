import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';

import rootReducer from './reducers';

export const history = createHistory();

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(routerMiddleware(history));
  }

  return applyMiddleware(routerMiddleware(history), createLogger());
};

export const store = createStore(
  connectRouter(history)(rootReducer),
  composeWithDevTools(getMiddleware()),
);
