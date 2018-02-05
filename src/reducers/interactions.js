import { UPDATE_WINDOW_SIZE } from '../actions/interactions'
import { TOGGLE_DRAWER } from '../actions/interactions'
import { NOTIFY } from '../actions/interactions'
import { SHOW_OPEN_RELATIONS } from '../actions/interactions'
import { CLOSE_OPEN_RELATIONS } from '../actions/interactions'
import { ADD_OPEN_RELATION } from '../actions/interactions'
import { CHANGE_ACTIVE_OPEN_RELATION } from '../actions/interactions'
import { CHANGE_OPEN_RELATION } from '../actions/interactions'
import { REMOVE_OPEN_RELATION } from '../actions/interactions'
import { REMOVE_ALL_OPEN_RELATIONS } from '../actions/interactions'

const initialInteractionsState = {
  windowSize: 'small',
  drawerOpen: false,
  notifications: {
    message: '',
    type: ''
  },
  openRelations: {
    list: [],
    isShowing: false,
    activeIndex: -1
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
    case SHOW_OPEN_RELATIONS:
      return {
        ...state,
        openRelations: {
          ...state.openRelations,
          isShowing: true
        }
      }
    case CLOSE_OPEN_RELATIONS:
      return {
        ...state,
        openRelations: {
          ...state.openRelations,
          isShowing: false
        }
      }
    case ADD_OPEN_RELATION: {
      const filter = state.openRelations.list.filter(relation => {
        const { categoryId, itemId } = action.relation
        return (relation.categoryId === categoryId) && (relation.itemId === itemId)
      })
      const index = state.openRelations.list.indexOf(filter[0])
      if (index > -1) {
        return {
          ...state,
          openRelations: {
            ...state.openRelations,
            activeIndex: index
          }
        }
      }
      return {
        ...state,
        openRelations: {
          ...state.openRelations,
          list: [
            ...state.openRelations.list,
            {...action.relation}
          ],
          activeIndex: state.openRelations.list.length
        }
      }
    }
    case CHANGE_ACTIVE_OPEN_RELATION:
      return {
        ...state,
        openRelations: {
          ...state.openRelations,
          activeIndex: action.index
        }
      }
    case CHANGE_OPEN_RELATION:
      return {
        ...state,
        openRelations: {
          ...state.openRelations,
          list: [
            ...state.openRelations.list.slice(0,action.index),
            {...action.relation},
            ...state.openRelations.list.slice(action.index+1)
          ]
        }
      }
    case REMOVE_OPEN_RELATION:
      return {
        ...state,
        openRelations: {
          ...state.openRelations,
          list: [
            ...state.openRelations.list.slice(0,action.index),
            ...state.openRelations.list.slice(action.index+1)
          ]
        }
      }
    case REMOVE_ALL_OPEN_RELATIONS:
      return {
        ...state,
        openRelations: {
          ...state.openRelations,
          list: [],
          activeIndex: -1
        }
      }
    default:
      return state
  }
}

export default interactions