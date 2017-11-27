import API from '../utils/api'

export const REQUEST_CATEGORY_ITEMS = 'REQUEST_CATEGORY_ITEMS'
export const REQUEST_CATEGORY_ITEMS_ERROR = 'REQUEST_CATEGORY_ITEMS_ERROR'
export const RECEIVE_CATEGORY_ITEMS = 'RECEIVE_CATEGORY_ITEMS'
export const REQUEST_CATEGORY_ITEM = 'REQUEST_CATEGORY_ITEM'
export const REQUEST_CATEGORY_ITEM_ERROR = 'REQUEST_CATEGORY_ITEM_ERROR'
export const RECEIVE_CATEGORY_ITEM = 'RECEIVE_CATEGORY_ITEM'
export const NEW_CATEGORY_ITEM = 'NEW_CATEGORY_ITEM'
export const NEW_CATEGORY_ITEM_ERROR = 'NEW_CATEGORY_ITEM_ERROR'
export const CREATE_CATEGORY_ITEM = 'CREATE_CATEGORY_ITEM'
export const EDITION_CATEGORY_ITEM = 'EDITION_CATEGORY_ITEM'
export const EDITION_CATEGORY_ITEM_ERROR = 'EDITION_CATEGORY_ITEM_ERROR'
export const UPDATE_CATEGORY_ITEM = 'UPDATE_CATEGORY_ITEM'

export const requestItems = categoryId => ({
  type: REQUEST_CATEGORY_ITEMS,
  fetchedAllAt: Date.now(),
  categoryId
})

export const errorFetchingItems = (categoryId, error) => ({
  type: REQUEST_CATEGORY_ITEMS_ERROR,
  errorFetchingAll: `${Date.now()} ${error}`,
  categoryId
})

export const receiveItems = (categoryId, items) => ({
  type: RECEIVE_CATEGORY_ITEMS,
  receivedAllAt: Date.now(),
  categoryId,
  items
})

export const fetchItems = categoryId => dispatch => {
  dispatch(requestItems(categoryId))
  const params = {
    collection: 'categories_items',
    collectionId: categoryId
  }
  return API('firebase').fetch(params)
    .then(
      items => {
        dispatch(receiveItems(categoryId, items || {}))
      },
      error => {
        console.error(`An error occurred fetching items of ${categoryId}:`, error)
        dispatch(errorFetchingItems(categoryId, error))
      }
    )
}

export const shouldFetchItems = (state, categoryId) => {
  const { items } = state
  if (!items) {
    return true
  } else if (!items.flow[categoryId]) {
    return true
  } else if (items.flow[categoryId].isFetchingAll) {
    return false
  } else if (Date.now() - (items.flow[categoryId].fetchedAllAt || 100) < 100) {
    return false
  }
  return true
}

export const fetchItemsIfNeeded = categoryId => {
  return (dispatch, getState) => {
    if (shouldFetchItems(getState(), categoryId)) {
      return dispatch(fetchItems(categoryId))
    }
  }
}

export const requestItem = (categoryId, itemId) => ({
  type: REQUEST_CATEGORY_ITEM,
  fetchedItemAt: Date.now(),
  categoryId,
  itemId
})

export const errorFetchingItem = (categoryId, error) => ({
  type: REQUEST_CATEGORY_ITEM_ERROR,
  errorFetchingItem: `${Date.now()} ${error}`,
  categoryId
})

export const receiveItem = (categoryId, itemId, item) => ({
  type: RECEIVE_CATEGORY_ITEM,
  receivedItemAt: Date.now(),
  categoryId,
  itemId,
  item
})

export const fetchItem = (categoryId, itemId) => dispatch => {
  dispatch(requestItem(categoryId))
  const params = {
    collection: 'categories_items',
    collectionId: categoryId,
    documentId: itemId
  }
  return API('firebase').fetch(params)
    .then(
      item => {
        dispatch(receiveItem(categoryId, itemId, item || {}))
      },
      error => {
        console.error(`An error occurred fetching item ${itemId} of ${categoryId}:`, error)
        dispatch(errorFetchingItem(categoryId, error))
      }
    )
}

export const shouldFetchItem = (state, categoryId, itemId) => {
  const { categories, items } = state
  if (!categories) {
    return true
  } else if (!items) {
    return true
  } else if (!categories.byId[categoryId]) {
    return true
  } else if (!categories.byId[categoryId].items) {
    return true
  } else if (items.flow[categoryId].isFetchingItem) {
    return false
  } else if (!categories.byId[categoryId].items.find(item => item === itemId)) {
    return true
  }
  return false
}

export const fetchItemIfNeeded = (categoryId, itemId) => {
  return (dispatch, getState) => {
    if (shouldFetchItem(getState(), categoryId, itemId)) {
      return dispatch(fetchItem(categoryId, itemId))
    }
  }
}

export const newItem = categoryId => ({
  type: NEW_CATEGORY_ITEM,
  fetchedItemAt: Date.now(),
  categoryId
})

export const errorNewItem = (categoryId, error) => ({
  type: NEW_CATEGORY_ITEM_ERROR,
  errorFetchingItem: `${Date.now()} ${error}`,
  categoryId
})

export const createItem = (categoryId, itemId, item) => ({
  type: CREATE_CATEGORY_ITEM,
  receivedItemAt: Date.now(),
  categoryId,
  itemId,
  item
})

export const createNewItem = (categoryId, item) => dispatch => {
  dispatch(newItem(categoryId))
  const params = {
    collection: 'categories_items',
    collectionId: categoryId,
    generateDocumentId: true,
    document: item
  }
  return API('firebase').update(params)
    .then(
      documentId => {
        dispatch(createItem(categoryId, documentId, item))
      },
      error => {
        console.error(`An error occurred creating item of ${categoryId}:`, error)
        dispatch(errorNewItem(categoryId, error))
      }
    )
}