import { combineReducers } from 'redux'
import { RECEIVE_CATEGORIES } from '../actions/categories'
import { RECEIVING_CATEGORY_SETTINGS } from '../actions/settings'
import { RECEIVING_CATEGORY_SETTINGS_ERROR } from '../actions/settings'
import { RECEIVE_CATEGORY_SETTINGS } from '../actions/settings'

const initialFlowState = {}
const initialCategoryFlowState = {
  isFetching: false,
  fetchedAt: null,
  isReceived: false,
  receivedAt: null,
  errorFetching: null
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
    case RECEIVING_CATEGORY_SETTINGS: {
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetching: true,
          fetchedAt: action.fetchedAt
        }
      }
    }
    case RECEIVING_CATEGORY_SETTINGS_ERROR:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetching: false,
          isReceived: false,
          errorFetching: action.errorFetching
        }
      }
    case RECEIVE_CATEGORY_SETTINGS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetching: false,
          isReceived: true,
          receivedAt: action.receivedAt
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
    case RECEIVE_CATEGORY_SETTINGS:
      return [...new Set(state, action.settingsId)]
    default:
      return state
  }
}

export default combineReducers({ flow, byId, allIds })