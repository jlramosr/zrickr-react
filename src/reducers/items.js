import { combineReducers } from 'redux'
import { RECEIVE_CATEGORIES } from '../actions/categories'
import { RECEIVING_CATEGORY_ITEMS } from '../actions/items'
import { RECEIVING_CATEGORY_ITEMS_ERROR } from '../actions/items'
import { RECEIVE_CATEGORY_ITEMS } from '../actions/items'
import { RECEIVING_CATEGORY_ITEM } from '../actions/items'
import { RECEIVING_CATEGORY_ITEM_ERROR } from '../actions/items'
import { RECEIVE_CATEGORY_ITEM } from '../actions/items'
import { CREATING_CATEGORY_ITEM } from '../actions/items'
import { CREATING_CATEGORY_ITEM_ERROR } from '../actions/items'
import { CREATE_CATEGORY_ITEM } from '../actions/items'
import { UPDATING_CATEGORY_ITEM } from '../actions/items'
import { UPDATING_CATEGORY_ITEM_ERROR } from '../actions/items'
import { UPDATE_CATEGORY_ITEM } from '../actions/items'
import { UPDATE_CATEGORY_ITEMS } from '../actions/items'
import { REMOVING_CATEGORY_ITEM } from '../actions/items'
import { REMOVING_CATEGORY_ITEM_ERROR } from '../actions/items'
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
    case RECEIVING_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingAll: true,
          fetchedAllAt: action.fetchedAllAt,
          errorFetchingAll: null
        }
      }
    case RECEIVING_CATEGORY_ITEMS_ERROR:
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
    case RECEIVING_CATEGORY_ITEM:
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
    case RECEIVING_CATEGORY_ITEM_ERROR:
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
    case CREATING_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: true
        }
      }
    case CREATING_CATEGORY_ITEM_ERROR:
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
    case UPDATING_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: true
        }
      }
    case UPDATING_CATEGORY_ITEM_ERROR:
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
    case REMOVING_CATEGORY_ITEM:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isUpdating: true
        }
      }
    case REMOVING_CATEGORY_ITEM_ERROR:
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
          ...action.items[itemId],
          id: itemId
        }
      }), state)
    case RECEIVE_CATEGORY_ITEM: {
      return {
        ...state,
        [action.itemId]: {
          ...state[action.itemId],
          ...action.item,
          id: action.itemId
        }
      }
    }
    case CREATE_CATEGORY_ITEM:
      return {
        ...state,
        [action.itemId]: {
          ...action.item,
          id: action.itemId
        }
      }
    case UPDATE_CATEGORY_ITEM:
      return {
        ...state,
        [action.itemId]: {
          ...action.item
        }
      }
    case UPDATE_CATEGORY_ITEMS: {
      console.log("HOLA", action);
      return {
        ...state,
        ...action.itemIds.reduce((items, itemId) => ({
          ...items,
          [itemId]: {
            ...state.itemId,
            ...action.values
          }
        }),{})
      }
    }
    case REMOVE_CATEGORY_ITEM: {
      let {[action.itemId]: deleted, ...newState} = state
      return newState
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