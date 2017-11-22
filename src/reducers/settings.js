import { combineReducers } from 'redux'
import { REQUEST_CATEGORY_SETTINGS } from '../actions/settings'
import { RECEIVE_CATEGORY_SETTINGS } from '../actions/settings'
import { REQUEST_CATEGORY_SETTINGS_ERROR } from '../actions/settings'

const initialFlowState = {}
const initialByIdState = {}
const initialAllIdsState = []

const flow = (state = initialFlowState, action) => {
  switch (action.type) {
    case REQUEST_CATEGORY_SETTINGS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingAll: true,
          fetchedAllAt: action.fetchedAllAt,
          isReceivedAll: false
        }
      }
    case RECEIVE_CATEGORY_SETTINGS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetchingAll: false,
          isReceivedAll: true,
          receivedAllAt: action.receivedAllAt
        }
      }
    case REQUEST_CATEGORY_SETTINGS_ERROR:
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