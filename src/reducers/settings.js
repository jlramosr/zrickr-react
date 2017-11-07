import { combineReducers } from 'redux'
import { REQUEST_CATEGORY_SETTINGS } from '../actions/settings'
import { RECEIVE_CATEGORY_SETTINGS } from '../actions/settings'
import { REQUEST_CATEGORY_SETTINGS_ERROR } from '../actions/settings'

const initialFlowState = {
  isFetching: false,
  fetchedAt: null,
  errorFetching: null,
  isUpdating: false,
  updatedAt: null,
  errorUpdating: null,
  isReceived: false,
  receivedAt: null,
  categoryId: null
}

const initialByIdState = {}

const initialAllIdsState = []

const flow = (state = initialFlowState, action) => {
  switch (action.type) {
    case REQUEST_CATEGORY_SETTINGS:
      return {
        ...state,
        isFetching: true,
        fetchedAt: action.fetchedAt,
        categoryId: action.categoryId
      }
    case RECEIVE_CATEGORY_SETTINGS:
      return {
        ...state,
        isFetching: false,
        isReceived: true,
        receivedAt: action.receivedAt,
        categoryId: action.categoryId
      }
    case REQUEST_CATEGORY_SETTINGS_ERROR:
      return {
        ...state,
        isFetching: false,
        isReceived: false,
        errorFetching: action.errorFetching,
        categoryId: action.categoryId
      }
    default:
      return state
  }
}

const byId = (state = initialByIdState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORY_SETTINGS:
      return {
        ...state,
        [action.settingsId]: {
          id: action.settingsId,
          ...action.settings
        }
      }
    default:
      return state
  }
}

const allIds = (state = initialAllIdsState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORY_SETTINGS: {
      return [...new Set(state, action.settingsId)]
    }
    default:
      return state
  }
}

export default combineReducers({ flow, byId, allIds })