import API from '../utils/api'

export const REQUEST_CATEGORY_FIELDS = 'REQUEST_CATEGORY_FIELDS'
export const RECEIVE_CATEGORY_FIELDS = 'RECEIVE_CATEGORY_FIELDS'

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

export const fetchFields = categoryId => dispatch => {
  dispatch(requestFields(categoryId))
  return API('firebase').getCollection('categories_fields', categoryId)
    .then(
      fields => dispatch(receiveFields(categoryId, fields) || {}),
      error => console.log('ERROR PIDIENDO FIELDS', error)
    )
}