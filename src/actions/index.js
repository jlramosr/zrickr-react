import API from '../utils/api';

export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const ADD_CATEGORY = 'ADD_CATEGORY';


export const receiveCategories = categories => {
  type: RECEIVE_CATEGORIES,
  categories
}

export const fetchCategories = () => dispatch => (
  API('firebase')
    .getCollection('categories')
    .then(categories => {
      dispatch(receiveCategories(categories));
    })
    .catch(error => {
      console.log("ERROR PIDIENDO CATEGORIAS", error);
    })
);

export const addCategory = ({ name, icon, label }) => {
  type: ADD_CATEGORY,
  name,
  icon,
  label
}