import { snapshotToArray } from '../utils/helpers'
import { REQUEST_CATEGORIES } from '../actions/categories'
import { RECEIVE_CATEGORIES } from '../actions/categories'

const initialCategoriesState = {
  isFetching: false,
  isUpdating: false,
  isReceived: false,
  lastUpdated: null,
  items: []
}

const categories = (state = initialCategoriesState, action) => {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_CATEGORIES:
      return {
        ...state,
        isFetching: false,
        isReceived: true,
        items: snapshotToArray(action.items),
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

export default categories