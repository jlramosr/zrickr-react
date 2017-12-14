import { ADDING_OPEN_DIALOG } from '../actions/dialogs'
import { ADD_OPEN_DIALOG } from '../actions/dialogs'
import { REMOVING_OPEN_DIALOG } from '../actions/dialogs'
import { REMOVE_OPEN_DIALOG } from '../actions/dialogs'

const initialDialogsState = {
  openDialogs: [],
  isChanging: false
}

const dialogs = (state = initialDialogsState, action) => {
  switch (action.type) {
    case ADDING_OPEN_DIALOG:
    case REMOVING_OPEN_DIALOG: {
      if (state.openDialogs.length) {
        return {
          ...state,
          isChanging: true
        }
      }
      else {
        return state
      }
    }
    case ADD_OPEN_DIALOG: {
      if (state.openDialogs.includes(action.dialog)) {
        return state
      }
      return {
        ...state,
        isChanging: false,
        openDialogs: [
          ...state.openDialogs, {
            categoryId: action.categoryId,
            itemId: action.itemId
          }
        ]
      }
    }
    case REMOVE_OPEN_DIALOG:
      return {
        ...state,
        isChanging: false,
        openDialogs: state.openDialogs.slice(0,state.openDialogs.length-1)
      }
    default:
      return state
  }
}

export default dialogs