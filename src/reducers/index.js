import { RECEIVE_CATEGORIES } from '../actions';
import { ADD_CATEGORY } from '../actions';

const initialCategoriesState = {
  categories: [],
}

const categories = (state = initialCategoriesState, action) => {
  switch (action.type) {
    case RECEIVE_CATEGORIES:
      const { categories } = action
      return {
        ...state,
        categories,
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

export default categories;