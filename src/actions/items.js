import API from '../utils/api'

export const REQUEST_CATEGORY_ITEMS = 'REQUEST_CATEGORY_ITEMS'
export const REQUEST_CATEGORY_ITEMS_ERROR = 'REQUEST_CATEGORY_ITEMS_ERROR'
export const RECEIVE_CATEGORY_ITEMS = 'RECEIVE_CATEGORY_ITEMS'
export const REQUEST_CATEGORY_ITEM = 'REQUEST_CATEGORY_ITEM'
export const REQUEST_CATEGORY_ITEM_ERROR = 'REQUEST_CATEGORY_ITEM_ERROR'
export const RECEIVE_CATEGORY_ITEM = 'RECEIVE_CATEGORY_ITEM'

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
  return API('firebase').getCollection('categories_items', categoryId)
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
  const { categories, items } = state
  if (!categories) {
    return true
  } else if (!items) {
    return true
  } else if (!categories.byId[categoryId]) {
    return true
  } else if (!categories.byId[categoryId].items) {
    return true
  } else if (items.flow[categoryId].isFetchingAll) {
    return false
  }
  return !items.flow[categoryId].isReceivedAll
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
  return API('firebase').getCollection('categories_items', categoryId, itemId)
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
  } else if (!categories.byId[categoryId].items.find(item => item === itemId)) {
    return true
  } else if (items.flow[categoryId].isFetchingItem && items.flow[categoryId].itemFetched === itemId) {
    return false
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