import API from '../utils/api'

export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES'
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES'
export const ADD_CATEGORY = 'ADD_CATEGORY'

export const requestCategories = _ => ({
  type: REQUEST_CATEGORIES
})

export const receiveCategories = categories => ({
  type: RECEIVE_CATEGORIES,
  items: categories,
  receivedAt: Date.now()
})

export const fetchCategories = _ => (dispatch, getState) => {
  dispatch(requestCategories())
  return API('firebase').getCollection('categories')
    .then(
      categories => dispatch(receiveCategories(categories)),
      error => console.log("ERROR PIDIENDO CATEGORIAS", error)
    )
}