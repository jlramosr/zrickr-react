import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from 'material-ui/styles';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import categoriesReducer from './reducers';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import theme from './theme';
import './index.css';

import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import {withRouter} from 'react-router';


const logger = store => next => action => {
  /*console.group(action.type);
  console.info('dispatching', action);*/
  let result = next(action);
  /*console.log('next state', store.getState());
  console.groupEnd(action.type);*/
  return result;
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const history = createHistory();

const store = createStore(
  combineReducers({
    categories: categoriesReducer,
    router: routerReducer,
  }),
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(logger),
    applyMiddleware(routerMiddleware(history))
  )
)

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App/>
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)

registerServiceWorker();
