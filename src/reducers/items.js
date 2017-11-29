import { combineReducers } from 'redux'
import { RECEIVE_CATEGORIES } from '../actions/categories'
import { REQUEST_CATEGORY_ITEMS } from '../actions/items'
import { REQUEST_CATEGORY_ITEMS_ERROR } from '../actions/items'
import { RECEIVE_CATEGORY_ITEMS } from '../actions/items'
import { REQUEST_CATEGORY_ITEM } from '../actions/items'
import { REQUEST_CATEGORY_ITEM_ERROR } from '../actions/items'
import { RECEIVE_CATEGORY_ITEM } from '../actions/items'
import { NEW_CATEGORY_ITEM } from '../actions/items'
import { NEW_CATEGORY_ITEM_ERROR } from '../actions/items'
import { CREATE_CATEGORY_ITEM } from '../actions/items'
import { CHANGE_CATEGORY_ITEM } from '../actions/items'
import { CHANGE_CATEGORY_ITEM_ERROR } from '../actions/items'
import { UPDATE_CATEGORY_ITEM } from '../actions/items'
import { DELETION_CATEGORY_ITEM } from '../actions/items'
import { DELETION_CATEGORY_ITEM_ERROR } from '../actions/items'
import { REMOVE_CATEGORY_ITEM } from '../actions/items'

const initialFlowState = {}
const initialCategoryFlowState = {
  isFetchingAll: false,
  fetchedAllAt: null,
  isReceivedAll: false,
  receivedAllAt: null,
  errorFetchingAll: null,
  isFetchingItem: false,
  fetchedItemAt: null,
  itemFetched: null,
  isReceivedItem: false,
  errorFetchingItem: null,
  isUpdating: false,
  errorUpdating: null
}
const initialByIdState = {}
const initialAllIdsState = []

const flow = (state = initialFlowState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORIES:
      return Object.keys(action.categories).reduce((categories, categoryId) => ({
        ...categories, 
        [categoryId]: {
          ...initialCategoryFlowState,
          ...state[categoryId]
        }
      }), {})
    case REQUEST_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingAll: true,
          fetchedAllAt: action.fetchedAllAt,
          errorFetchingAll: null
        }
      }
    case REQUEST_CATEGORY_ITEMS_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingAll: false,
          isReceivedAll: false,
          errorFetchingAll: action.error
        }
      }
    case RECEIVE_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingAll: false,
          isReceivedAll: true,
          receivedAllAt: action.receivedAllAt,
          errorFetchingAll: null
        }
      }
    case REQUEST_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingItem: true,
          fetchedItemAt: action.fetchedItemAt,
          itemFetched: action.itemId,
          errorFetchingItem: null
        }
      }
    case REQUEST_CATEGORY_ITEM_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingItem: false,
          isReceivedItem: false,
          errorFetchingItem: action.error
        }
      }
    case RECEIVE_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingItem: false,
          isReceivedItem: true,
          receivedItemAt: action.receivedItemAt,
          itemReceived: action.itemId,
          errorFetchingItem: null
        }
      }
    case NEW_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: true
        }
      }
    case NEW_CATEGORY_ITEM_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: false,
          errorUpdating: action.error
        }
      }
    case CREATE_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: false
        }
      }
    case CHANGE_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: true
        }
      }
    case CHANGE_CATEGORY_ITEM_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: false,
          errorUpdating: action.error
        }
      }
    case UPDATE_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: false
        }
      }
    case DELETION_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: true
        }
      }
    case DELETION_CATEGORY_ITEM_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: false,
          errorUpdating: action.error
        }
      }
    case REMOVE_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: false
        }
      }
    default:
      return state
  }
}

const byId = (state = initialByIdState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORY_ITEMS:
      return Object.keys(action.items).reduce((items, itemId) => ({
        ...items, 
        [itemId]: {
          id: itemId,
          ...action.items[itemId]
        }
      }), state)
    case RECEIVE_CATEGORY_ITEM:
      return {
        ...state,
        [action.itemId]: {
          ...state[action.itemId],
          ...action.item
        }
      }
    case CREATE_CATEGORY_ITEM:
      return {
        ...state,
        [action.itemId]: action.item
      }
    case UPDATE_CATEGORY_ITEM:
      return {
        ...state,
        [action.itemId]: {
          ...state[action.itemId],
          ...action.item
        }
      }
    case REMOVE_CATEGORY_ITEM: {
      delete state[action.itemId]
      return state
    }
    default:
      return state
  }
}

const allIds = (state = initialAllIdsState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORY_ITEMS:
      return [...new Set(state, Object.keys(action.items))]
    default:
      return state
  }
}

export default combineReducers({ flow, byId, allIds })