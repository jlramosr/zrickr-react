import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { offline } from '@redux-offline/redux-offline'
import defaultConfig from '@redux-offline/redux-offline/lib/defaults'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
//import createActionBuffer from 'redux-action-buffer'
//import logger from 'redux-logger'
import app from './reducers/app'
import categories from './reducers/categories'
import settings from './reducers/settings'
import fields from './reducers/fields'
import items from './reducers/items'
import dialogs from './reducers/dialogs'
import drawer from './reducers/drawer'
import notifier from './reducers/notifier'

const offlineConfig = {
  ...defaultConfig,
  persistOptions: {
    blacklist: ['dialogs', 'drawer', 'notifier'],
    keyPrefix: 'reduxPersist:'
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createHistory()

const reducer = combineReducers({
  router: routerReducer,
  app,
  categories,
  dialogs,
  drawer,
  fields,
  items,
  notifier,
  settings
})

const enhancer = composeEnhancers(
  applyMiddleware(
    thunk,
    routerMiddleware(history),
    //createActionBuffer('persist/REHYDRATE'),
    //logger
  ),
  offline(offlineConfig),
)

export default createStore(reducer, undefined, enhancer)