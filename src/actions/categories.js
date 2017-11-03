import API from '../utils/api'

export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES'
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES'
export const ADD_CATEGORY = 'ADD_CATEGORY'

export const requestCategories = () => ({
  type: REQUEST_CATEGORIES,
  fetchingAt: Date.now()
})

export const receiveCategories = categories => ({
  type: RECEIVE_CATEGORIES,
  receivedAt: Date.now(),
  categories
})

export const fetchCategories = _ => dispatch => {
  dispatch(requestCategories())
  return API('firebase').getCollection('categories')
    .then(
      categories => dispatch(receiveCategories(categories || {})),
      error => console.log('ERROR PIDIENDO CATEGORIAS', error)
    )
}