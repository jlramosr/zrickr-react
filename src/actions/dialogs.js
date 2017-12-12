export const OPEN_DIALOG = 'OPEN_DIALOG'
export const CLOSE_DIALOG = 'CLOSE_DIALOG'

export const openDialog = dialogId => ({
  type: OPEN_DIALOG,
  dialogId
})

export const closeDialog = dialogId => ({
  type: CLOSE_DIALOG,
  dialogId
})