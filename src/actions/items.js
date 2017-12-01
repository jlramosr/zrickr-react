import API from '../utils/api'

export const RECEIVING_CATEGORY_ITEMS = 'RECEIVING_CATEGORY_ITEMS'
export const RECEIVING_CATEGORY_ITEMS_ERROR = 'RECEIVING_CATEGORY_ITEMS_ERROR'
export const RECEIVE_CATEGORY_ITEMS = 'RECEIVE_CATEGORY_ITEMS'
export const RECEIVING_CATEGORY_ITEM = 'RECEIVING_CATEGORY_ITEM'
export const RECEIVING_CATEGORY_ITEM_ERROR = 'RECEIVING_CATEGORY_ITEM_ERROR'
export const RECEIVE_CATEGORY_ITEM = 'RECEIVE_CATEGORY_ITEM'
export const CREATING_CATEGORY_ITEM = 'CREATING_CATEGORY_ITEM'
export const CREATING_CATEGORY_ITEM_ERROR = 'CREATING_CATEGORY_ITEM_ERROR'
export const CREATE_CATEGORY_ITEM = 'CREATE_CATEGORY_ITEM'
export const UPDATING_CATEGORY_ITEM = 'UPDATING_CATEGORY_ITEM'
export const UPDATING_CATEGORY_ITEM_ERROR = 'UPDATING_CATEGORY_ITEM_ERROR'
export const UPDATE_CATEGORY_ITEM = 'UPDATE_CATEGORY_ITEM'
export const REMOVING_CATEGORY_ITEM = 'REMOVING_CATEGORY_ITEM'
export const REMOVING_CATEGORY_ITEM_ERROR = 'REMOVING_CATEGORY_ITEM_ERROR'
export const REMOVE_CATEGORY_ITEM = 'REMOVE_CATEGORY_ITEM'

const _receivingItemsAction = categoryId => ({
  type: RECEIVING_CATEGORY_ITEMS,
  fetchedAllAt: Date.now(),
  categoryId
})

const _errorReceivingItemsAction = (categoryId, error) => ({
  type: RECEIVING_CATEGORY_ITEMS_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId
})

const _receiveItemsAction = (categoryId, items) => ({
  type: RECEIVE_CATEGORY_ITEMS,
  receivedAllAt: Date.now(),
  categoryId,
  items
})

const _receivingItemAction = (categoryId, itemId) => ({
  type: RECEIVING_CATEGORY_ITEM,
  fetchedItemAt: Date.now(),
  categoryId,
  itemId
})

const _errorReceivingItemAction = (categoryId, error) => ({
  type: RECEIVING_CATEGORY_ITEM_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId
})

const _receiveItemAction = (categoryId, itemId, item) => ({
  type: RECEIVE_CATEGORY_ITEM,
  receivedItemAt: Date.now(),
  categoryId,
  itemId,
  item
})

const _creatingItemAction = categoryId => ({
  type: CREATING_CATEGORY_ITEM,
  categoryId
})

const _errorCreatingItemAction = (categoryId, error) => ({
  type: CREATING_CATEGORY_ITEM_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId
})

const _createItemAction = (categoryId, itemId, item) => ({
  type: CREATE_CATEGORY_ITEM,
  createdItemAt: Date.now(),
  categoryId,
  itemId,
  item
})

const _updatingItemAction = (categoryId, itemId) => ({
  type: UPDATING_CATEGORY_ITEM,
  categoryId,
  itemId
})

const _errorUpdatingItemAction = (categoryId, itemId, error) => ({
  type: UPDATING_CATEGORY_ITEM_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId,
  itemId
})

const _updateItemAction = (categoryId, itemId, item) => ({
  type: UPDATE_CATEGORY_ITEM,
  updatedItemAt: Date.now(),
  categoryId,
  itemId,
  item
})

const _removingItemAction = (categoryId, itemId) => ({
  type: REMOVING_CATEGORY_ITEM,
  categoryId,
  itemId
})

const _errorRemovingItemAction = (categoryId, itemId, error) => ({
  type: REMOVING_CATEGORY_ITEM_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId,
  itemId
})

const _removeItemAction = (categoryId, itemId) => ({
  type: REMOVE_CATEGORY_ITEM,
  deletedItemAt: Date.now(),
  categoryId,
  itemId
})

const _shouldFetchItems = (state, categoryId) => {
  const { items } = state
  if (items && items.flow[categoryId] && items.flow[categoryId].isFetchingAll) {
    return false
  }
  return true
}

const _shouldFetchItemsIfNeeded = (state, categoryId) => {
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

const _shouldFetchItem = (state, categoryId) => {
  const { items } = state
  if (items && items.flow[categoryId] && items.flow[categoryId].isFetchingItem) {
    return false
  }
  return true
}

const _shouldFetchItemIfNeeded = (state, categoryId, itemId) => {
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

const _shouldUpdateItem = (state, categoryId) => {
  const { items } = state
  if (items && items.flow[categoryId] && items.flow[categoryId].isUpdating) {
    return false
  }
  return true
}

const _fetchItems = categoryId => dispatch => {
  dispatch(_receivingItemsAction(categoryId))
  const params = {
    collection: 'categories_items',
    collectionId: categoryId
  }
  return API('firebase').fetch(params)
    .then(
      items => {
        dispatch(_receiveItemsAction(categoryId, items || {}))
      },
      error => {
        console.error(`An error occurred fetching items of ${categoryId}:`, error)
        dispatch(_errorReceivingItemsAction(categoryId, error))
      }
    )
}

const _fetchItem = (categoryId, itemId) => dispatch => {
  dispatch(_receivingItemAction(categoryId))
  const params = {
    collection: 'categories_items',
    collectionId: categoryId,
    documentId: itemId
  }
  return API('firebase').fetch(params)
    .then(
      item => {
        dispatch(_receiveItemAction(categoryId, itemId, item || {}))
      },
      error => {
        console.error(`An error occurred fetching item ${itemId} of ${categoryId}:`, error)
        dispatch(_errorReceivingItemAction(categoryId, error))
      }
    )
}

const _createItem = (categoryId, item) => dispatch => {
  dispatch(_creatingItemAction(categoryId))
  const newItem = {createdAt: Date.now(), ...item}
  const params = {
    collection: 'categories_items',
    collectionId: categoryId,
    generateDocumentId: true,
    document: newItem
  }
  return new Promise((resolve, reject) => {
    API('firebase').update(params).then(
      documentId => {
        dispatch(_createItemAction(categoryId, documentId, newItem))
        resolve(documentId)
      },
      error => {
        dispatch(_errorCreatingItemAction(categoryId, error))
        reject(`An error occurred creating item of ${categoryId}:`, error)
      }
    )
  })
}

const _updateItem = (categoryId, itemId, item) => dispatch => {
  dispatch(_updatingItemAction(categoryId))
  const updatedItem = {updatedAt: Date.now(), ...item}
  const params = {
    collection: 'categories_items',
    collectionId: categoryId,
    documentId: itemId,
    document: item
  }
  return new Promise((resolve, reject) => {
    API('firebase').update(params).then(
      documentId => {
        dispatch(_updateItemAction(categoryId, documentId, updatedItem))
        resolve(documentId)
      },
      error => {
        dispatch(_errorUpdatingItemAction(categoryId, error))
        reject(`An error occurred updating item ${itemId} of ${categoryId}:`, error)
      }
    )
  })
}

const _removeItem = (categoryId, itemId) => dispatch => {
  dispatch(_removingItemAction(categoryId))
  const params = {
    collection: 'categories_items',
    collectionId: categoryId,
    documentId: itemId,
    document: null
  }
  return new Promise((resolve, reject) => {
    API('firebase').update(params).then(
      documentId => {
        dispatch(_removeItemAction(categoryId, documentId))
        resolve(documentId)
      },
      error => {
        dispatch(_errorRemovingItemAction(categoryId, itemId, error))
        reject(`An error occurred deleting item ${itemId} of ${categoryId}:`, error)
      }
    )
  })
}

const _reject = errorMessage => {
  return new Promise((resolve, reject) =>
    reject(errorMessage || 'Another process is currently in progress')
  )
}

export const fetchItems = categoryId => {
  return (dispatch, getState) => {
    if (_shouldFetchItems(getState(), categoryId)) {
      return dispatch(_fetchItems(categoryId))
    }
  }
}

export const fetchItemsIfNeeded = categoryId => {
  return (dispatch, getState) => {
    if (_shouldFetchItemsIfNeeded(getState(), categoryId)) {
      return dispatch(_fetchItems(categoryId))
    }
  }
}

export const fetchItem = (categoryId, itemId) => {
  return (dispatch, getState) => {
    if (_shouldFetchItem(getState(), categoryId, itemId)) {
      return dispatch(_fetchItem(categoryId, itemId))
    }
  }
}

export const fetchItemIfNeeded = (categoryId, itemId) => {
  return (dispatch, getState) => {
    if (_shouldFetchItemIfNeeded(getState(), categoryId, itemId)) {
      return dispatch(_fetchItem(categoryId, itemId))
    }
  }
}

export const createItem = (categoryId, item) => {
  return (dispatch, getState) => {
    if (_shouldUpdateItem(getState(), categoryId)) {
      return dispatch(_createItem(categoryId, item))
    }
    return _reject()
  }
}

export const updateItem = (categoryId, itemId, item) => {
  return (dispatch, getState) => {
    if (_shouldUpdateItem(getState(), categoryId)) {
      return dispatch(_updateItem(categoryId, itemId, item))
    }
    return _reject()
  }
}

export const removeItem = (categoryId, item) => {
  return (dispatch, getState) => {
    if (_shouldUpdateItem(getState(), categoryId)) {
      return dispatch(_removeItem(categoryId, item))
    }
    return _reject()
  }
}