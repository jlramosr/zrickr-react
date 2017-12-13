import { ADD_OPEN_DIALOG } from '../actions/dialogs'
import { REMOVE_OPEN_DIALOG } from '../actions/dialogs'

const initialDialogsState = {
  openedDialogs: []
}

const dialogs = (state = initialDialogsState, action) => {
  switch (action.type) {
    case ADD_OPEN_DIALOG: {
      if (state.openedDialogs.includes(action.dialogId)) {
        return state
      }
      return {
        ...state,
        openedDialogs: [
          ...state.openedDialogs,
          action.dialogId
        ]
      }
    }
    case REMOVE_OPEN_DIALOG: {
      return {
        ...state,
        openedDialogs: state.openedDialogs.filter(dialogId => 
          dialogId !== action.dialogId
        )
      }
    }
    default:
      return state
  }
}

export default dialogs