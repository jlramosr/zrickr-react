import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import categoriesReducer from './reducers/categories'
import drawerReducer from './reducers/drawer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createHistory()

export default createStore(
  combineReducers({
    router: routerReducer,
    drawer: drawerReducer,
    categories: categoriesReducer
  }),
  composeEnhancers(
    applyMiddleware(thunk, logger, routerMiddleware(history))
  )
)