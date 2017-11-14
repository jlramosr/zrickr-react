import { combineReducers } from 'redux'
import { REQUEST_CATEGORY_ITEMS } from '../actions/items'
import { RECEIVE_CATEGORY_ITEMS } from '../actions/items'
import { REQUEST_CATEGORY_ITEMS_ERROR } from '../actions/items'

const initialFlowState = {
  isFetching: false,
  fetchingAt: null,
  isUpdating: false,
  updatedAt: null,
  isReceived: false,
  receivedAt: null,
  categoryId: null
}

const initialByIdState = {}

const initialAllIdsState = []

const flow = (state = initialFlowState, action) => {
  switch (action.type) {
    case REQUEST_CATEGORY_ITEMS:
      return {
        ...state,
        isFetching: true,
        fetchingAt: action.fetchingAt
      }
    case RECEIVE_CATEGORY_ITEMS:
      return {
        ...state,
        isFetching: false,
        isReceived: true,
        receivedAt: action.receivedAt
      }
    case REQUEST_CATEGORY_ITEMS_ERROR:
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
    case RECEIVE_CATEGORY_ITEMS:
      return Object.keys(action.items).reduce((items, itemId) => ({
        ...items, 
        [itemId]: {
          id: itemId,
          ...action.items[itemId]
        }
      }), state)
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