import { combineReducers } from 'redux'
//import { REHYDRATE } from '../actions/categories'
import { REQUEST_CATEGORIES } from '../actions/categories'
import { RECEIVE_CATEGORIES } from '../actions/categories'
import { REQUEST_CATEGORIES_ERROR } from '../actions/categories'
import { RECEIVE_CATEGORY_SETTINGS } from '../actions/settings'
import { RECEIVE_CATEGORY_FIELDS } from '../actions/fields'
import { RECEIVE_CATEGORY_ITEMS } from '../actions/items'

const initialFlowState = {
  isFetching: false,
  fetchedAt: null,
  errorFetching: null,
  isUpdating: false,
  updatedAt: null,
  errorUpdating: null,
  isReceived: false,
  receivedAt: null
}

const initialByIdState = {}

const initialAllIdsState = []

const flow = (state = initialFlowState, action) => {
  switch (action.type) {
    /*case REHYDRATE:
      if (action.payload) {
        return {
          ...action.payload.categories.flow,
          isFetching: false,
          isReceived: false
        }
      }
      return state
      // break omitted*/
    case REQUEST_CATEGORIES:
      return {
        ...state,
        isFetching: true,
        fetchedAt: action.fetchingAt
      }
    case RECEIVE_CATEGORIES:
      return {
        ...state,
        isFetching: false,
        isReceived: true,
        receivedAt: action.receivedAt
      }
    case REQUEST_CATEGORIES_ERROR:
      return {
        ...state,
        isFetching: false,
        isReceived: false,
        errorFetching: action.errorFetching
      }
    default:
      return state
  }
}

const byId = (state = initialByIdState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORIES:
      return Object.keys(action.categories).reduce((categories, categoryId) => ({
        ...categories, 
        [categoryId]: {
          ...state[categoryId],
          id: categoryId,
          ...action.categories[categoryId]
        }
      }), {})
    case RECEIVE_CATEGORY_SETTINGS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          settings: action.settingsId
        }
      }
    case RECEIVE_CATEGORY_FIELDS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          fields: Object.keys(action.fields)
        }
      }
    case RECEIVE_CATEGORY_ITEMS: {
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          items: Object.keys(action.items)
        }
      }
    }
    default:
      return state
  }
}

const allIds = (state = initialAllIdsState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORIES:
      return Object.keys(action.categories)
    default:
      return state
  }
}

export default combineReducers({ flow, byId, allIds })