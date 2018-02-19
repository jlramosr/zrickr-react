import API from '../utils/api'

//export const REHYDRATE = 'persist/REHYDRATE'
export const RECEIVING_CATEGORIES = 'RECEIVING_CATEGORIES'
export const RECEIVING_CATEGORIES_ERROR = 'RECEIVING_CATEGORIES_ERROR'
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES'

const _receivingCategoriesAction = () => ({
  type: RECEIVING_CATEGORIES,
  fetchingAllAt: Date.now()
})

const _errorReceivingCategoriesAction = (categoryId, error) => ({
  type: RECEIVING_CATEGORIES_ERROR,
  errorFetchingAll: `${Date.now()} ${error}`,
  categoryId
})

const _receiveCategoriesAction = categories => ({
  type: RECEIVE_CATEGORIES,
  receivedAllAt: Date.now(),
  categories
})

const _fetchCategories = () => dispatch => {
  dispatch(_receivingCategoriesAction())
  const params = {
    mainCollectionId: process.env.REACT_APP_CATEGORIES_URL
  }
  return API(process.env.REACT_APP_CATEGORIES_SOURCE).fetch(params)
    .then(
      categories => {
        dispatch(_receiveCategoriesAction(categories || {}))
      },
      error => {
        console.error('An error occurred fetching categories:', error)
        dispatch(_errorReceivingCategoriesAction(error))
      }
    )
}

const _shouldFetchCategories = state => {
  const { categories } = state
  if (categories && categories.flow.isFetchingAll) {
    return false
  }
  return true
}

const _shouldFetchCategoriesIfNeeded = state => {
  const { categories } = state
  if (!categories) {
    return true
  } else if (categories.flow.isFetchingAll) {
    return false
  }
  return !categories.flow.isReceivedAll
}

export const fetchCategories = () => {
  return (dispatch, getState) => {
    if (_shouldFetchCategories(getState())) {
      return dispatch(_fetchCategories())
    }
  }
}

export const fetchCategoriesIfNeeded = () => {
  return (dispatch, getState) => {
    if (_shouldFetchCategoriesIfNeeded(getState())) {
      return dispatch(_fetchCategories())
    }
  }
}