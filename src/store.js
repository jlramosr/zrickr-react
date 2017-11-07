import { createStore, applyMiddleware, compose } from 'redux'
import { persistCombineReducers , persistStore } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
//import logger from 'redux-logger'
import app from './reducers/app'
import categories from './reducers/categories'
import settings from './reducers/settings'
import fields from './reducers/fields'
import items from './reducers/items'
import drawer from './reducers/drawer'

const config = {
  key: 'root',
  storage
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createHistory()

const configureStore = () => {
  const store = createStore(
    persistCombineReducers(config, {
      router: routerReducer,
      app,
      categories,
      settings,
      fields,
      items,
      drawer
    }),
    composeEnhancers(
      applyMiddleware(thunk, routerMiddleware(history), /*logger*/)
    )
  )

  const persistor = persistStore(store)

  return { persistor, store }
}

export default configureStore