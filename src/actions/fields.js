import API from '../utils/api'

export const REQUEST_CATEGORY_FIELDS = 'REQUEST_CATEGORY_FIELDS'
export const RECEIVE_CATEGORY_FIELDS = 'RECEIVE_CATEGORY_FIELDS'
export const REQUEST_CATEGORY_FIELDS_ERROR = 'REQUEST_CATEGORY_FIELDS_ERROR'

export const requestFields = categoryId => ({
  type: REQUEST_CATEGORY_FIELDS,
  fetchingAt: Date.now(),
  categoryId
})

export const receiveFields = (categoryId, fields) => ({
  type: RECEIVE_CATEGORY_FIELDS,
  receivedAt: Date.now(),
  categoryId,
  fields
})

export const errorFetchingFields = (categoryId, error) => ({
  type: REQUEST_CATEGORY_FIELDS_ERROR,
  errorFetching: `${Date.now()} ${error}`,
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