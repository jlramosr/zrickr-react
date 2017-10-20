import { combineReducers } from 'redux';
import { RECEIVE_CATEGORIES } from '../actions';
import { ADD_CATEGORY } from '../actions';

const initialCategoriesState = {
  clients: {
    icon: 'Work',
    label: 'Clients',
  },
}

const categories = (state = initialCategoriesState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORIES:
      const { categories } = action
      return {
        ...categories,
      }
    case ADD_CATEGORY:
      const { name, icon, label } = action
      return {
        ...state,
        [name]: {icon, label},
      }
    default:
      return state
  }
}

export default combineReducers({
  categories
})