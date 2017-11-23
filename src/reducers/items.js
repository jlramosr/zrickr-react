import { combineReducers } from 'redux'
import { RECEIVE_CATEGORIES } from '../actions/categories'
import { REQUEST_CATEGORY_ITEMS } from '../actions/items'
import { REQUEST_CATEGORY_ITEMS_ERROR } from '../actions/items'
import { RECEIVE_CATEGORY_ITEMS } from '../actions/items'
import { REQUEST_CATEGORY_ITEM } from '../actions/items'
import { REQUEST_CATEGORY_ITEM_ERROR } from '../actions/items'
import { RECEIVE_CATEGORY_ITEM } from '../actions/items'

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
  errorFetchingItem: null
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
          errorFetchingAll: action.errorFetchingAll
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
          errorFetchingItem: action.errorFetchingItem
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