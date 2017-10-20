import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from 'material-ui/styles';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import theme from './theme';
import './index.css';

const logger = store => next => action => {
  /*console.group(action.type);
  console.info('dispatching', action);*/
  let result = next(action);
  /*console.log('next state', store.getState());
  console.groupEnd(action.type);*/
  return result;
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(logger),
    applyMiddleware(thunk)
  )
)

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
