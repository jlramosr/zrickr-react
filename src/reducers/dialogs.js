import { OPEN_DIALOG } from '../actions/dialogs'
import { CLOSE_DIALOG } from '../actions/dialogs'

const initialDialogsState = {
  openedDialogs: []
}

const dialogs = (state = initialDialogsState, action) => {
  const dialogId = action.dialogId
  switch (action.type) {
    case OPEN_DIALOG: {
      if (state.openedDialogs.includes(dialogId)) {
        return state
      }
      return {
        ...state,
        openedDialogs: [
          ...state.openedDialogs,
          dialogId
        ]
      }
    }
    case CLOSE_DIALOG: {
      const [dialogId, ...openedDialogs] = state.openedDialogs
      if (!openedDialogs.length) {
        return initialDialogsState
      }
      return {
        ...state,
        openedDialogs
      }
    }
    default:
      return state
  }
}

export default dialogs