export const ADD_OPEN_DIALOG = 'ADD_OPENED_DIALOG'
export const REMOVE_OPEN_DIALOG = 'REMOVE_OPENED_DIALOG'

export const addOpenDialog = dialogId => ({
  type: ADD_OPEN_DIALOG,
  dialogId
})

export const removeOpenDialog = dialogId => ({
  type: REMOVE_OPEN_DIALOG,
  dialogId
})