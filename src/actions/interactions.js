export const UPDATE_WINDOW_SIZE = 'UPDATE_WINDOW_SIZE'
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER'
export const NOTIFY = 'NOTIFY'
export const SHOW_RELATIONS = 'SHOW_RELATIONS'
export const CLOSE_RELATIONS = 'CLOSE_RELATIONS'
export const ADD_OPEN_RELATION = 'ADD_OPEN_RELATION'
export const REMOVE_OPEN_RELATION = 'REMOVE_OPEN_RELATION'
export const REMOVE_ALL_OPEN_RELATIONS = 'REMOVE_ALL_OPEN_RELATIONS'

export const updateWindowSize = size => ({
  type: UPDATE_WINDOW_SIZE,
  size
})

export const toggleDrawer = open => ({
  type: TOGGLE_DRAWER,
  open
})

export const notify = (message, type) => ({
  type: NOTIFY,
  notificationMessage: message,
  notificationType: type
})

export const showRelations = () => ({
  type: SHOW_RELATIONS
})

export const closeRelations = () => ({
  type: CLOSE_RELATIONS
})

export const addOpenRelation = (categoryId, itemId) => ({
  type: ADD_OPEN_RELATION,
  categoryId,
  itemId
})

export const removeOpenRelation = index => ({
  type: REMOVE_OPEN_RELATION,
  index
})

export const removeAllOpenRelations = () => ({
  type: REMOVE_ALL_OPEN_RELATIONS
})
