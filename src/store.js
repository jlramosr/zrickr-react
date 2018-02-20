import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { offline } from '@redux-offline/redux-offline'
import defaultConfig from '@redux-offline/redux-offline/lib/defaults'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import createActionBuffer from 'redux-action-buffer'
//import logger from 'redux-logger'
import app from './reducers/app'
import categories from './reducers/categories'
import settings from './reducers/settings'
import fields from './reducers/fields'
import items from './reducers/items'
import interactions from './reducers/interactions'

const offlineConfig = {
  ...defaultConfig,
  persistOptions: {
    blacklist: ['interactions', 'router'],
    keyPrefix: 'reduxPersist:'
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createHistory()

const reducer = combineReducers({
  router: routerReducer,
  app,
  categories,
  fields,
  interactions,
  items,
  settings
})

const enhancer = composeEnhancers(
  offline(offlineConfig),
  applyMiddleware(
    thunk,
    routerMiddleware(history),
    createActionBuffer('persist/REHYDRATE'),
    //logger
  ),
  
)

export default createStore(reducer, undefined, enhancer)