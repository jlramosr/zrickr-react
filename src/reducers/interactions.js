import { UPDATE_WINDOW_SIZE } from '../actions/interactions'
import { TOGGLE_DRAWER } from '../actions/interactions'
import { NOTIFY } from '../actions/interactions'
import { SHOW_RELATIONS } from '../actions/interactions'
import { CLOSE_RELATIONS } from '../actions/interactions'
import { ADD_OPEN_RELATION } from '../actions/interactions'
import { REMOVE_OPEN_RELATION } from '../actions/interactions'
import { REMOVE_ALL_OPEN_RELATIONS } from '../actions/interactions'

const initialInteractionsState = {
  windowSize: 'small',
  drawerOpen: false,
  notifications: {
    message: '',
    type: ''
  },
  relations: {
    openRelations: [],
    isShowing: false
  }
}

const interactions = (state = initialInteractionsState, action) => {
  switch (action.type) {
    case UPDATE_WINDOW_SIZE:
      return {
        ...state,
        windowSize: action.size
      }
    case TOGGLE_DRAWER:
      return {
        ...state,
        drawerOpen: action.open
      }
    case NOTIFY:
      return {
        ...state,
        notifications: {
          message: action.notificationMessage,
          type: action.notificationType
        }
      }
    case SHOW_RELATIONS:
      return {
        ...state,
        relations: {
          ...state.relations,
          isShowing: true
        }
      }
    case CLOSE_RELATIONS:
      return {
        ...state,
        relations: {
          ...state.relations,
          isShowing: false
        }
      }
    case ADD_OPEN_RELATION:
      return {
        ...state,
        relations: {
          ...state.relations,
          openRelations: [
            ...state.relations.openRelations, {
              categoryId: action.categoryId,
              itemId: action.itemId
            }
          ]
        }
      }
    case REMOVE_OPEN_RELATION:
      return {
        ...state,
        relations: {
          ...state.relations,
          openRelations: [
            ...state.relations.openRelations.slice(0,action.index),
            ...state.relations.openRelations.slice(action.index+1)
          ]
        }
      }
    case REMOVE_ALL_OPEN_RELATIONS:
      return {
        ...state,
        relations: {
          ...state.relations,
          openRelations: []
        }
      }
    default:
      return state
  }
}

export default interactions