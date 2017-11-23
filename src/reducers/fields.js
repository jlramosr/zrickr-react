import { combineReducers } from 'redux'
import { RECEIVE_CATEGORIES } from '../actions/categories'
import { REQUEST_CATEGORY_FIELDS } from '../actions/fields'
import { RECEIVE_CATEGORY_FIELDS } from '../actions/fields'
import { REQUEST_CATEGORY_FIELDS_ERROR } from '../actions/fields'

const initialFlowState = {}
const initialCategoryFlowState = {
  isFetchingAll: false,
  fetchedAllAt: null,
  isReceivedAll: false,
  receivedAllAt: null,
  errorFetchingAll: null
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
    case REQUEST_CATEGORY_FIELDS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingAll: true,
          fetchedAllAt: action.fetchedAllAt
        }
      }
    case RECEIVE_CATEGORY_FIELDS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingAll: false,
          isReceivedAll: true,
          receivedAllAt: action.receivedAllAt
        }
      }
    case REQUEST_CATEGORY_FIELDS_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingAll: false,
          isReceivedAll: false,
          errorFetchingAll: action.errorFetchingAll
        }
      }
    default:
      return state
  }
}

const byId = (state = initialByIdState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORY_FIELDS:
      return Object.keys(action.fields).reduce((fields, fieldId) => ({
        ...fields, 
        [fieldId]: {
          id: fieldId,
          ...action.fields[fieldId]
        }
      }), state)
    default:
      return state
  }
}

const allIds = (state = initialAllIdsState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORY_FIELDS: {
      return [...new Set(state, Object.keys(action.fields))]
    }
    default:
      return state
  }
}

export default combineReducers({ flow, byId, allIds })