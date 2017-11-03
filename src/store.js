import { createStore, applyMiddleware, compose } from 'redux'
import { persistCombineReducers , persistStore } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import appReducer from './reducers/app'
import categoriesReducer from './reducers/categories'
import drawerReducer from './reducers/drawer'

const config = {
  key: 'root',
  storage
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createHistory()

const configureStore = () => {
  const store = createStore(
    persistCombineReducers(config, {
      app: appReducer,
      router: routerReducer,
      categories: categoriesReducer,
      drawer: drawerReducer
    }),
    composeEnhancers(
      applyMiddleware(thunk, routerMiddleware(history), logger)
    )
  )

  const persistor = persistStore(store)

  return { persistor, store }
}

export default configureStore