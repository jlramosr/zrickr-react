export const ADD_OPEN_RELATION = 'ADD_OPEN_RELATION'
export const REMOVE_OPEN_RELATION = 'REMOVE_OPEN_RELATION'
export const REMOVE_ALL_OPEN_RELATIONS = 'REMOVE_ALL_OPEN_RELATIONS'

export const addOpenRelation = (categoryId, itemId) => ({
  type: ADD_OPEN_RELATION,
  categoryId,
  itemId
})

export const removeOpenRelation = () => ({
  type: REMOVE_OPEN_RELATION
})

export const removeAllOpenRelations = () => ({
  type: REMOVE_ALL_OPEN_RELATIONS
})
