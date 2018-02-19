import API from '../utils/api'

export const RECEIVING_CATEGORY_ITEMS = 'RECEIVING_CATEGORY_ITEMS'
export const RECEIVING_CATEGORY_ITEMS_ERROR = 'RECEIVING_CATEGORY_ITEMS_ERROR'
export const RECEIVE_CATEGORY_ITEMS = 'RECEIVE_CATEGORY_ITEMS'
export const RECEIVING_CATEGORY_ITEM = 'RECEIVING_CATEGORY_ITEM'
export const RECEIVING_CATEGORY_ITEM_ERROR = 'RECEIVING_CATEGORY_ITEM_ERROR'
export const RECEIVE_CATEGORY_ITEM = 'RECEIVE_CATEGORY_ITEM'
export const CREATING_CATEGORY_ITEMS = 'CREATING_CATEGORY_ITEMS'
export const CREATING_CATEGORY_ITEMS_ERROR = 'CREATING_CATEGORY_ITEMS_ERROR'
export const CREATE_CATEGORY_ITEMS = 'CREATE_CATEGORY_ITEMS'
export const UPDATING_CATEGORY_ITEMS = 'UPDATING_CATEGORY_ITEMS'
export const UPDATING_CATEGORY_ITEMS_ERROR = 'UPDATING_CATEGORY_ITEMS_ERROR'
export const UPDATE_CATEGORY_ITEMS = 'UPDATE_CATEGORY_ITEMS'
export const REMOVING_CATEGORY_ITEMS = 'REMOVING_CATEGORY_ITEMS'
export const REMOVING_CATEGORY_ITEMS_ERROR = 'REMOVING_CATEGORY_ITEMS_ERROR'
export const REMOVE_CATEGORY_ITEMS = 'REMOVE_CATEGORY_ITEMS'

const convertArraysToObject = item => {
  for (const fieldKey of Object.keys(item)) {
    const fieldValue = item[fieldKey]
    if (Array.isArray(fieldValue)) {
      item[fieldKey] = fieldValue.reduce((obj,subvalue) => {
        return {...obj, [subvalue]: true}
      }, {})
    } 
  }
  return item
} 

const receivingItemsAction = categoryId => ({
  type: RECEIVING_CATEGORY_ITEMS,
  fetchedAllAt: Date.now(),
  categoryId
})

const errorReceivingItemsAction = (categoryId, error) => ({
  type: RECEIVING_CATEGORY_ITEMS_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId
})

const receiveItemsAction = (categoryId, items) => ({
  type: RECEIVE_CATEGORY_ITEMS,
  receivedAllAt: Date.now(),
  categoryId,
  items
})

const receivingItemAction = (categoryId, itemId) => ({
  type: RECEIVING_CATEGORY_ITEM,
  fetchedItemAt: Date.now(),
  categoryId,
  itemId
})

const errorReceivingItemAction = (categoryId, error) => ({
  type: RECEIVING_CATEGORY_ITEM_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId
})

const receiveItemAction = (categoryId, itemId, item) => ({
  type: RECEIVE_CATEGORY_ITEM,
  receivedItemAt: Date.now(),
  categoryId,
  itemId,
  item
})

const creatingItemAction = categoryId => ({
  type: CREATING_CATEGORY_ITEMS,
  categoryId
})

const errorCreatingItemAction = (categoryId, error) => ({
  type: CREATING_CATEGORY_ITEMS_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId
})

const createItemsAction = (categoryId, itemIds, values) => ({
  type: CREATE_CATEGORY_ITEMS,
  createdItemAt: Date.now(),
  categoryId,
  itemIds,
  values
})

const updatingItemsAction = categoryId => ({
  type: UPDATING_CATEGORY_ITEMS,
  categoryId
})

const errorUpdatingItemsAction = (categoryId, itemIds, error) => ({
  type: UPDATING_CATEGORY_ITEMS_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId,
  itemIds
})

const updateItemsAction = (categoryId, itemIds, values) => ({
  type: UPDATE_CATEGORY_ITEMS,
  updatedItemAt: Date.now(),
  categoryId,
  itemIds,
  values
})

const removingItemsAction = (categoryId, itemIds) => ({
  type: REMOVING_CATEGORY_ITEMS,
  categoryId,
  itemIds
})

const errorRemovingItemsAction = (categoryId, itemIds, error) => ({
  type: REMOVING_CATEGORY_ITEMS_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId,
  itemIds
})

const removeItemsAction = (categoryId, itemIds) => ({
  type: REMOVE_CATEGORY_ITEMS,
  deletedItemAt: Date.now(),
  categoryId,
  itemIds
})

const shouldFetchItems = (state, categoryId) => {
  const { items } = state
  if (items && items.flow[categoryId] && items.flow[categoryId].isFetchingAll) {
    return false
  }
  return true
}

const shouldFetchItemsIfNeeded = (state, categoryId) => {
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
  return !items.flow[categoryId].isReceivedAll
}

const shouldFetchItem = (state, categoryId) => {
  const { items } = state
  if (items && items.flow[categoryId] && items.flow[categoryId].isFetchingItem) {
    return false
  }
  return true
}

const shouldFetchItemIfNeeded = (state, categoryId, itemId) => {
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

const shouldUpdateItems = (state, categoryId) => {
  const { items } = state
  if (items && items.flow[categoryId] && items.flow[categoryId].isChanging) {
    return false
  }
  return true
}

const _fetchItems = categoryId => dispatch => {
  dispatch(receivingItemsAction(categoryId))
  const params = {
    mainCollectionId: process.env.REACT_APP_ITEMS_URL,
    collectionId: categoryId
  }
  return API(process.env.REACT_APP_ITEMS_SOURCE).fetch(params)
    .then(
      items => {
        dispatch(receiveItemsAction(categoryId, items || {}))
      },
      error => {
        console.error(`An error occurred fetching items of ${categoryId}:`, error)
        dispatch(errorReceivingItemsAction(categoryId, error))
      }
    )
}

const _fetchItem = (categoryId, itemId) => dispatch => {
  dispatch(receivingItemAction(categoryId))
  const params = {
    mainCollectionId: process.env.REACT_APP_ITEMS_URL,
    collectionId: categoryId,
    documentId: itemId
  }
  return API(process.env.REACT_APP_ITEMS_SOURCE).fetch(params)
    .then(
      item => {
        dispatch(receiveItemAction(categoryId, itemId, item || {}))
      },
      error => {
        console.error(error)
        dispatch(errorReceivingItemAction(categoryId, error))
      }
    )
}

const _createItems = (categoryId, values, quantity) => dispatch => {
  dispatch(creatingItemAction(categoryId))
  const newValues = {createdAt: Date.now(), ...convertArraysToObject(values)}
  const params = {
    mainCollectionId: process.env.REACT_APP_ITEMS_URL,
    collectionId: categoryId,
    values: newValues,
    quantity
  }
  return new Promise((resolve, reject) => {
    API(process.env.REACT_APP_ITEMS_SOURCE).create(params).then(
      documentIds => {
        dispatch(createItemsAction(categoryId, documentIds, newValues))
        resolve(documentIds)
      },
      error => {
        console.error(error)
        dispatch(errorCreatingItemAction(categoryId, error))
        reject(error)
      }
    )
  })
}

const _updateItems = (categoryId, itemIds, values) => dispatch => {
  dispatch(updatingItemsAction(categoryId))
  const newValues = {...convertArraysToObject(values), updatedAt: Date.now()}
  const params = {
    mainCollectionId: process.env.REACT_APP_ITEMS_URL,
    collectionId: categoryId,
    documentIds: itemIds,
    values: newValues
  }
  return new Promise((resolve, reject) => {
    API(process.env.REACT_APP_ITEMS_SOURCE).update(params).then(
      documentIds => {
        dispatch(updateItemsAction(categoryId, documentIds, newValues))
        resolve(documentIds)
      },
      error => {
        console.error(error)
        dispatch(errorUpdatingItemsAction(categoryId, error))
        reject(error)
      }
    )
  })
}

const _removeItems = (categoryId, itemIds) => dispatch => {
  dispatch(removingItemsAction(categoryId))
  const params = {
    mainCollectionId: process.env.REACT_APP_ITEMS_URL,
    collectionId: categoryId,
    documentIds: itemIds
  }
  return new Promise((resolve, reject) => {
    API(process.env.REACT_APP_ITEMS_SOURCE).remove(params).then(
      documentId => {
        dispatch(removeItemsAction(categoryId, documentId))
        resolve(documentId)
      },
      error => {
        console.error(error)
        dispatch(errorRemovingItemsAction(categoryId, itemIds, error))
        reject(`An error occurred deleting item ${itemIds} of ${categoryId}:`, error)
      }
    )
  })
}

const refuseTask = errorMessage =>
  new Promise((resolve, reject) => reject(errorMessage || 'Another process is currently in progress'))

export const fetchItems = categoryId => (dispatch, getState) =>
  shouldFetchItems(getState(), categoryId) ? dispatch(_fetchItems(categoryId)) : null

export const fetchItemsIfNeeded = categoryId => (dispatch, getState) =>
  shouldFetchItemsIfNeeded(getState(), categoryId) ? dispatch(_fetchItems(categoryId)) : null

export const fetchItem = (categoryId, itemId) => (dispatch, getState) =>
  shouldFetchItem(getState(), categoryId, itemId) ? dispatch(_fetchItem(categoryId, itemId)) : null

export const fetchItemIfNeeded = (categoryId, itemId) => (dispatch, getState) =>
  shouldFetchItemIfNeeded(getState(), categoryId, itemId) ? dispatch(_fetchItem(categoryId, itemId)) : null

export const createItems = (categoryId, values, quantity) => (dispatch, getState) =>
  shouldUpdateItems(getState(), categoryId) ? dispatch(_createItems(categoryId, values, quantity)) : refuseTask()

export const updateItems = (categoryId, itemIds, values) => (dispatch, getState) =>
  shouldUpdateItems(getState(), categoryId) ? dispatch(_updateItems(categoryId, itemIds, values)) : refuseTask()

export const removeItems = (categoryId, itemIds) => (dispatch, getState) =>
  shouldUpdateItems(getState(), categoryId) ? dispatch(_removeItems(categoryId, itemIds)) : refuseTask()