import API from '../utils/api'

//export const REHYDRATE = 'persist/REHYDRATE'
export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES'
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES'

export const requestCategories = () => ({
  type: REQUEST_CATEGORIES,
  fetchingAt: Date.now()
})

export const receiveCategories = categories => ({
  type: RECEIVE_CATEGORIES,
  receivedAt: Date.now(),
  categories
})

export const fetchCategories = () => dispatch => {
  dispatch(requestCategories())
  return API('firebase').getCollection('categories')
    .then(
      categories => dispatch(receiveCategories(categories || {})),
      error => console.log('ERROR PIDIENDO CATEGORIAS', error)
    )
}

export const shouldFetchCategories = state => {
  const { categories } = state
  if (!categories) {
    return true
  } else if (categories.flow.isFetching) {
    return false
  }
  return !categories.flow.isReceived
}

export const fetchCategoriesIfNeeded = () => {
  return (dispatch, getState) => {
    if (shouldFetchCategories(getState())) {
      return dispatch(fetchCategories())
    }
  }
}