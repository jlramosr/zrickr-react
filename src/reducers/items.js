import { combineReducers } from 'redux'
import { RECEIVE_CATEGORIES } from '../actions/categories'
import { RECEIVING_CATEGORY_ITEMS } from '../actions/items'
import { RECEIVING_CATEGORY_ITEMS_ERROR } from '../actions/items'
import { RECEIVE_CATEGORY_ITEMS } from '../actions/items'
import { RECEIVING_CATEGORY_ITEM } from '../actions/items'
import { RECEIVING_CATEGORY_ITEM_ERROR } from '../actions/items'
import { RECEIVE_CATEGORY_ITEM } from '../actions/items'
import { CREATING_CATEGORY_ITEMS } from '../actions/items'
import { CREATING_CATEGORY_ITEMS_ERROR } from '../actions/items'
import { CREATE_CATEGORY_ITEMS } from '../actions/items'
import { UPDATING_CATEGORY_ITEMS } from '../actions/items'
import { UPDATING_CATEGORY_ITEMS_ERROR } from '../actions/items'
import { UPDATE_CATEGORY_ITEMS } from '../actions/items'
import { REMOVING_CATEGORY_ITEMS } from '../actions/items'
import { REMOVING_CATEGORY_ITEMS_ERROR } from '../actions/items'
import { REMOVE_CATEGORY_ITEMS } from '../actions/items'

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
  isChanging: false,
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
    case CREATING_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isChanging: true
        }
      }
    case CREATING_CATEGORY_ITEMS_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isChanging: false,
          errorUpdating: action.error
        }
      }
    case CREATE_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isChanging: false
        }
      }
    case UPDATING_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isChanging: true
        }
      }
    case UPDATING_CATEGORY_ITEMS_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isChanging: false,
          errorUpdating: action.error
        }
      }
    case UPDATE_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isChanging: false
        }
      }
    case REMOVING_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isChanging: true
        }
      }
    case REMOVING_CATEGORY_ITEMS_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isChanging: false,
          errorUpdating: action.error
        }
      }
    case REMOVE_CATEGORY_ITEMS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isChanging: false
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
    case CREATE_CATEGORY_ITEMS: {
      return Array.isArray(action.itemIds) ? {
        ...state,
        ...action.itemIds.reduce((items, itemId) => ({
          ...items,
          [itemId]: {
            ...action.values,
            id: itemId
          }
        }), {})
      } : {
        ...state,
        [action.itemIds]: {
          ...action.values,
          id: action.itemIds
        }
      }
    }
    case UPDATE_CATEGORY_ITEMS:
      return Array.isArray(action.itemIds) ? {
        ...state,
        ...action.itemIds.reduce((items, itemId) => ({
          ...items,
          [itemId]: {
            ...state[itemId],
            ...action.values
          }
        }), {})
      } : {
        ...state,
        [action.itemIds]: {
          ...action.values
        }
      }
    case REMOVE_CATEGORY_ITEMS: {
      if (Array.isArray(action.itemIds)) {
        return action.itemIds.reduce((items, itemId) => ({
          ...items,
          [itemId]: deleted
        }), state)
      }
      let { [action.itemIds]: deleted, ...newState } = state
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