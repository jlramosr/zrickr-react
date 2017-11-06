import API from '../utils/api'

export const REQUEST_CATEGORY_ITEMS = 'REQUEST_CATEGORY_ITEMS'
export const RECEIVE_CATEGORY_ITEMS = 'RECEIVE_CATEGORY_ITEMS'

export const requestItems = categoryId => ({
  type: REQUEST_CATEGORY_ITEMS,
  fetchingAt: Date.now(),
  categoryId
})

export const receiveItems = (categoryId, items) => ({
  type: RECEIVE_CATEGORY_ITEMS,
  receivedAt: Date.now(),
  categoryId,
  items
})

export const fetchItems = categoryId => dispatch => {
  dispatch(requestItems())
  return API('firebase').getCollection('categories_items', categoryId)
    .then(
      items => dispatch(receiveItems(categoryId, items || {})),
      error => console.log('ERROR PIDIENDO ITEMS', error)
    )
}