import { RECEIVE_CATEGORIES } from '../actions';
import { ADD_CATEGORY } from '../actions';

const initialCategoriesState = [];

const categories = (state = initialCategoriesState, action) => {
  console.log(state, action);
  switch (action.type) {
    case RECEIVE_CATEGORIES:
      return action.categories;
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