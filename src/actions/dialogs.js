export const ADDING_OPEN_DIALOG = 'ADDING_OPEN_DIALOG'
export const ADD_OPEN_DIALOG = 'ADD_OPEN_DIALOG'
export const REMOVING_OPEN_DIALOG = 'REMOVING_OPEN_DIALOG'
export const REMOVE_OPEN_DIALOG = 'REMOVE_OPEN_DIALOG'

const addingOpenDialog = () => ({
  type: ADDING_OPEN_DIALOG
})

const addOpenDialog2 = (categoryId, itemId) => ({
  type: ADD_OPEN_DIALOG,
  categoryId,
  itemId
})

const removingOpenDialog = () => ({
  type: REMOVING_OPEN_DIALOG
})

const removeOpenDialog2 = () => ({
  type: REMOVE_OPEN_DIALOG
})

export const addOpenDialog = (categoryId, itemId) => dispatch => {
  dispatch(addingOpenDialog())
  setTimeout(() => {
    dispatch(addOpenDialog2(categoryId, itemId))
  }, 10)
}

export const removeOpenDialog = () => dispatch => {
  dispatch(removingOpenDialog())
  setTimeout(() => {
    dispatch(removeOpenDialog2())
  }, 2000)
}