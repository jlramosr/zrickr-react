import { combineReducers } from 'redux'
//import { REHYDRATE } from '../actions/categories'
import { REQUEST_CATEGORIES } from '../actions/categories'
import { RECEIVE_CATEGORIES } from '../actions/categories'
import { REQUEST_CATEGORIES_ERROR } from '../actions/categories'
import { RECEIVE_CATEGORY_SETTINGS } from '../actions/settings'
import { RECEIVE_CATEGORY_FIELDS } from '../actions/fields'
import { RECEIVE_CATEGORY_ITEMS } from '../actions/items'
import { RECEIVE_CATEGORY_ITEM } from '../actions/items'

const initialFlowState = {
  isFetchingAll: false,
  fetchedAllAt: null,
  errorFetchingAll: null,
  errorUpdatingAll: null,
  isReceivedAll: false,
  receivedAllAt: null
}
const initialByIdState = {}
const initialAllIdsState = []

const flow = (state = initialFlowState, action) => {
  switch (action.type) {
    /*case REHYDRATE:
      if (action.payload) {
        return {
          ...action.payload.categories.flow,
          isFetchingAll: false,
          isReceivedAll: false
        }
      }
      return state
      // break omitted*/
    case REQUEST_CATEGORIES:
      return {
        ...state,
        isFetchingAll: true,
        fetchedAtAll: action.fetchingAllAt
      }
    case RECEIVE_CATEGORIES:
      return {
        ...state,
        isFetchingAll: false,
        isReceivedAll: true,
        receivedAllAt: action.receivedAllAt
      }
    case REQUEST_CATEGORIES_ERROR:
      return {
        ...state,
        isFetchingAll: false,
        isReceivedAll: false,
        errorFetchingAll: action.errorFetchingAll
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
    case RECEIVE_CATEGORY_ITEM: {
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          items: [...state[action.categoryId].items || [], action.itemId]
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