import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import grey from 'material-ui/colors/grey';
import amber from 'material-ui/colors/amber';
import red from 'material-ui/colors/red';
import './index.css';

let theme = createMuiTheme({
  standards: {
    colors: {
      primary: grey,
      secondary: amber,
      error: red,
    },
    toolbarHeights: {
      mobilePortrait: 56,
      mobileLandscape: 48,
      tabletDesktop: 64,
    },
    drawerWidth: 240,
    fontFamily:
      '-apple-system,system-ui,BlinkMacSystemFont,' +
      '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  },
});

theme = {
  ...theme,
  overrides: {
    ...theme.overrides,
    MuiDrawer: {
      paper: {
        width: theme.standards.drawerWidth,
      }
    },
  },
  palette: {
    ...theme.palette,
    ...theme.standards.colors,
  },
  typography: {
    ...theme.typography,
    fontFamily: theme.standards.fontFamily,
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: theme.standards.toolbarHeights.mobilePortrait,
      [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        minHeight: theme.standards.toolbarHeights.mobileLandscape,
      },
      [theme.breakpoints.up('sm')]: {
        minHeight: theme.standards.toolbarHeights.tabletDesktop,
      },
    },
  },
}


const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd(action.type);
  return result;
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(logger)
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
