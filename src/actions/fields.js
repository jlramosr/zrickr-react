import API from '../utils/api'

export const REQUEST_CATEGORY_FIELDS = 'REQUEST_CATEGORY_FIELDS'
export const RECEIVE_CATEGORY_FIELDS = 'RECEIVE_CATEGORY_FIELDS'
export const REQUEST_CATEGORY_FIELDS_ERROR = 'REQUEST_CATEGORY_FIELDS_ERROR'

export const requestFields = categoryId => ({
  type: REQUEST_CATEGORY_FIELDS,
  fetchedAllAt: Date.now(),
  categoryId
})

export const receiveFields = (categoryId, fields) => ({
  type: RECEIVE_CATEGORY_FIELDS,
  receivedAllAt: Date.now(),
  categoryId,
  fields
})

export const errorFetchingFields = (categoryId, error) => ({
  type: REQUEST_CATEGORY_FIELDS_ERROR,
  errorFetchingAll: `${Date.now()} ${error}`,
  categoryId
})

export const fetchFields = categoryId => dispatch => {
  dispatch(requestFields(categoryId))
  return API('firebase').getCollection('categories_fields', categoryId)
    .then(
      fields => {
        dispatch(receiveFields(categoryId, fields) || {})
      },
      error => {
        console.error(`An error occurred fetching fields of ${categoryId}:`, error)
        dispatch(errorFetchingFields(categoryId, error))
      }
    )
}

export const shouldFetchFields = (state, categoryId) => {
  const { categories, fields } = state
  if (!categories) {
    return true
  } else if (!fields) {
    return true
  } else if (!categories.byId[categoryId]) {
    return true
  } else if (!categories.byId[categoryId].fields) {
    return true
  } else if (fields.flow[categoryId].isFetchingAll) {
    return false
  }
  return !fields.flow[categoryId].isReceivedAll
}

export const fetchFieldsIfNeeded = categoryId => {
  return (dispatch, getState) => {
    if (shouldFetchFields(getState(), categoryId)) {
      return dispatch(fetchFields(categoryId))
    }
  }
}