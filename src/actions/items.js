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
export const CHANGE_CATEGORY_ITEM = 'CHANGE_CATEGORY_ITEM'
export const CHANGE_CATEGORY_ITEM_ERROR = 'CHANGE_CATEGORY_ITEM_ERROR'
export const UPDATE_CATEGORY_ITEM = 'UPDATE_CATEGORY_ITEM'
export const DELETION_CATEGORY_ITEM = 'DELETION_CATEGORY_ITEM'
export const DELETION_CATEGORY_ITEM_ERROR = 'DELETION_CATEGORY_ITEM_ERROR'
export const REMOVE_CATEGORY_ITEM = 'REMOVE_CATEGORY_ITEM'

const _requestItems = categoryId => ({
  type: REQUEST_CATEGORY_ITEMS,
  fetchedAllAt: Date.now(),
  categoryId
})

const _errorFetchingItems = (categoryId, error) => ({
  type: REQUEST_CATEGORY_ITEMS_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId
})

const _receiveItems = (categoryId, items) => ({
  type: RECEIVE_CATEGORY_ITEMS,
  receivedAllAt: Date.now(),
  categoryId,
  items
})

const _requestItem = (categoryId, itemId) => ({
  type: REQUEST_CATEGORY_ITEM,
  fetchedItemAt: Date.now(),
  categoryId,
  itemId
})

const _errorFetchingItem = (categoryId, error) => ({
  type: REQUEST_CATEGORY_ITEM_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId
})

const _receiveItem = (categoryId, itemId, item) => ({
  type: RECEIVE_CATEGORY_ITEM,
  receivedItemAt: Date.now(),
  categoryId,
  itemId,
  item
})

const _newItem = categoryId => ({
  type: NEW_CATEGORY_ITEM,
  categoryId
})

const _errorNewItem = (categoryId, error) => ({
  type: NEW_CATEGORY_ITEM_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId
})

const _createItem = (categoryId, itemId, item) => ({
  type: CREATE_CATEGORY_ITEM,
  createdItemAt: Date.now(),
  categoryId,
  itemId,
  item
})

const _changeItem = (categoryId, itemId) => ({
  type: CHANGE_CATEGORY_ITEM,
  categoryId,
  itemId
})

const _errorChangeItem = (categoryId, itemId, error) => ({
  type: CHANGE_CATEGORY_ITEM_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId,
  itemId
})

const _updateItem = (categoryId, itemId, item) => ({
  type: UPDATE_CATEGORY_ITEM,
  updatedItemAt: Date.now(),
  categoryId,
  itemId,
  item
})

const _deletionItem = (categoryId, itemId) => ({
  type: DELETION_CATEGORY_ITEM,
  categoryId,
  itemId
})

const _deletionchangeItem = (categoryId, itemId, error) => ({
  type: DELETION_CATEGORY_ITEM_ERROR,
  error: `${Date.now()} ${error}`,
  categoryId,
  itemId
})

const _removeItem = (categoryId, itemId) => ({
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
  return true
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
  dispatch(_requestItems(categoryId))
  const params = {
    collection: 'categories_items',
    collectionId: categoryId
  }
  return API('firebase').fetch(params)
    .then(
      items => {
        dispatch(_receiveItems(categoryId, items || {}))
      },
      error => {
        console.error(`An error occurred fetching items of ${categoryId}:`, error)
        dispatch(_errorFetchingItems(categoryId, error))
      }
    )
}

const _fetchItem = (categoryId, itemId) => dispatch => {
  dispatch(_requestItem(categoryId))
  const params = {
    collection: 'categories_items',
    collectionId: categoryId,
    documentId: itemId
  }
  return API('firebase').fetch(params)
    .then(
      item => {
        dispatch(_receiveItem(categoryId, itemId, item || {}))
      },
      error => {
        console.error(`An error occurred fetching item ${itemId} of ${categoryId}:`, error)
        dispatch(_errorFetchingItem(categoryId, error))
      }
    )
}

const _createNewItem = (categoryId, item) => dispatch => {
  dispatch(_newItem(categoryId))
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
        dispatch(_createItem(categoryId, documentId, newItem))
        resolve(documentId)
      },
      error => {
        dispatch(_errorNewItem(categoryId, error))
        reject(`An error occurred creating item of ${categoryId}:`, error)
      }
    )
  })
}

const _renewItem = (categoryId, itemId, item) => dispatch => {
  dispatch(_changeItem(categoryId))
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
        dispatch(_updateItem(categoryId, documentId, updatedItem))
        resolve(documentId)
      },
      error => {
        dispatch(_errorChangeItem(categoryId, error))
        reject(`An error occurred updating item ${itemId} of ${categoryId}:`, error)
      }
    )
  })
}

const _deleteItem = (categoryId, itemId) => dispatch => {
  dispatch(_deletionItem(categoryId))
  const params = {
    collection: 'categories_items',
    collectionId: categoryId,
    documentId: itemId,
    document: null
  }
  return new Promise((resolve, reject) => {
    API('firebase').update(params).then(
      documentId => {
        dispatch(_removeItem(categoryId, documentId))
        resolve(documentId)
      },
      error => {
        dispatch(_deletionchangeItem(categoryId, itemId, error))
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
    if (
      _shouldFetchItems(getState(), categoryId) &&
      _shouldFetchItemsIfNeeded(getState(), categoryId)
    ) {
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
    if (
      _shouldFetchItem(getState(), categoryId, itemId) &&
      _shouldFetchItemIfNeeded(getState(), categoryId, itemId)
    ) {
      return dispatch(_fetchItem(categoryId, itemId))
    }
  }
}

export const createNewItem = (categoryId, item) => {
  return (dispatch, getState) => {
    if (_shouldUpdateItem(getState(), categoryId)) {
      return dispatch(_createNewItem(categoryId, item))
    }
    return _reject()
  }
}

export const renewItem = (categoryId, itemId, item) => {
  return (dispatch, getState) => {
    if (_shouldUpdateItem(getState(), categoryId)) {
      return dispatch(_renewItem(categoryId, itemId, item))
    }
    return _reject()
  }
}

export const deleteItem = (categoryId, item) => {
  return (dispatch, getState) => {
    if (_shouldUpdateItem(getState(), categoryId)) {
      return dispatch(_deleteItem(categoryId, item))
    }
    return _reject()
  }
}



