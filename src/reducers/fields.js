import { combineReducers } from 'redux'
import { REQUEST_CATEGORY_FIELDS } from '../actions/fields'
import { RECEIVE_CATEGORY_FIELDS } from '../actions/fields'

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
    case REQUEST_CATEGORY_FIELDS:
      return {
        ...state,
        isFetching: true,
        fetchingAt: action.fetchingAt,
        categoryId: action.categoryId
      }
    case RECEIVE_CATEGORY_FIELDS:
      return {
        ...state,
        isFetching: false,
        isReceived: true,
        receivedAt: action.receivedAt,
        categoryId: action.categoryId
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
          ...state[fieldId],
          id: fieldId,
          ...action.fields[fieldId]
        }
      }), {})
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