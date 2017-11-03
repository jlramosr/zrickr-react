import { combineReducers } from 'redux'
import { REQUEST_CATEGORIES } from '../actions/categories'
import { RECEIVE_CATEGORIES } from '../actions/categories'

const initialFlowState = {
  isFetching: false,
  fetchingAt: null,
  isUpdating: false,
  updatedAt: null,
  isReceived: false,
  receivedAt: null
}

const initialByIdState = {}

const initialAllIdsState = []

const flow = (state = initialFlowState, action) => {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return {
        ...state,
        isFetching: true,
        fetchingAt: action.fetchingAt
      }
    case RECEIVE_CATEGORIES:
      return {
        ...state,
        isFetching: false,
        isReceived: true,
        receivedAt: action.receivedAt
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
          ...action.categories[categoryId]
        }
      }), {})
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