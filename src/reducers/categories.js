import { combineReducers } from 'redux'
import { RECEIVING_CATEGORIES } from '../actions/categories'
import { RECEIVING_CATEGORIES_ERROR } from '../actions/categories'
import { RECEIVE_CATEGORIES } from '../actions/categories'
import { RECEIVE_CATEGORY_SETTINGS } from '../actions/settings'
import { RECEIVE_CATEGORY_FIELDS } from '../actions/fields'
import { RECEIVE_CATEGORY_ITEMS } from '../actions/items'
import { RECEIVE_CATEGORY_ITEM } from '../actions/items'
import { CREATE_CATEGORY_ITEM } from '../actions/items'
import { REMOVE_CATEGORY_ITEM } from '../actions/items'

const initialFlowState = {
  isFetchingAll: false,
  fetchedAllAt: null,
  errorFetchingAll: null,
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
    case RECEIVING_CATEGORIES:
      return {
        ...state,
        isFetchingAll: true,
        fetchedAllAt: action.fetchingAllAt
      }
    case RECEIVE_CATEGORIES:
      return {
        ...state,
        isFetchingAll: false,
        isReceivedAll: true,
        receivedAllAt: action.receivedAllAt
      }
    case RECEIVING_CATEGORIES_ERROR:
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
          id: categoryId,
          settings: null,
          fields: [],
          items: [],
          ...state[categoryId],
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
    case RECEIVE_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          items: Object.keys(action.items)
        }
      }
    case RECEIVE_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          items:
            state[action.categoryId].items.includes(action.itemId) ? (
              state[action.categoryId].items
            ) : (
              [...state[action.categoryId].items || [], action.itemId]
            )
        }
      }
    case CREATE_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          items: [...state[action.categoryId].items || [], action.itemId]
        }
      }
    case REMOVE_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          items: state[action.categoryId].items.filter(
            itemId => itemId !== action.itemId
          )
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