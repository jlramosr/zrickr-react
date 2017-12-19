import { ADD_OPEN_RELATION } from '../actions/relations'
import { REMOVE_OPEN_RELATION } from '../actions/relations'
import { REMOVE_ALL_OPEN_RELATIONS } from '../actions/relations'

const initialRelationsState = {
  openRelations: []
}

const relations = (state = initialRelationsState, action) => {
  switch (action.type) {
    case ADD_OPEN_RELATION: {
      if (state.openRelations.includes(action.relation)) {
        return state
      }
      return {
        ...state,
        isChanging: false,
        openRelations: [
          ...state.openRelations, {
            categoryId: action.categoryId,
            itemId: action.itemId
          }
        ]
      }
    }
    case REMOVE_OPEN_RELATION:
      return {
        ...state,
        isChanging: false,
        openRelations: state.openRelations.slice(0,state.openRelations.length-1)
      }
    case REMOVE_ALL_OPEN_RELATIONS:
      return initialRelationsState
    default:
      return state
  }
}

export default relations