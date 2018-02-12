import API from '../utils/api'

export const RECEIVING_CATEGORY_FIELDS = 'RECEIVING_CATEGORY_FIELDS'
export const RECEIVING_CATEGORY_FIELDS_ERROR = 'RECEIVING_CATEGORY_FIELDS_ERROR'
export const RECEIVE_CATEGORY_FIELDS = 'RECEIVE_CATEGORY_FIELDS'

const _receivingFieldsAction = categoryId => ({
  type: RECEIVING_CATEGORY_FIELDS,
  fetchedAllAt: Date.now(),
  categoryId
})

const _errorReceivingFieldsAction = (categoryId, error) => ({
  type: RECEIVING_CATEGORY_FIELDS_ERROR,
  errorFetchingAll: `${Date.now()} ${error}`,
  categoryId
})

const _receiveFieldsAction = (categoryId, fields) => ({
  type: RECEIVE_CATEGORY_FIELDS,
  receivedAllAt: Date.now(),
  categoryId,
  fields
})


const _fetchFields = categoryId => dispatch => {
  dispatch(_receivingFieldsAction(categoryId))
  const params = {
    mainCollectionId: 'categories_fields',
    collectionId: categoryId
  }
  return API('firebase').fetch(params)
    .then(
      fields => {
        dispatch(_receiveFieldsAction(categoryId, fields) || {})
      },
      error => {
        console.error(`An error occurred fetching fields of ${categoryId}:`, error)
        dispatch(_errorReceivingFieldsAction(categoryId, error))
      }
    )
}

const _shouldFetchFields = (state, categoryId) => {
  const { fields } = state
  if (fields && fields.flow[categoryId] && fields.flow[categoryId].isFetching) {
    return false
  }
  return true
}

const _shouldFetchFieldsIfNeeded = (state, categoryId) => {
  const { fields } = state
  if (!fields) {
    return true
  } else if (!fields.flow[categoryId]) {
    return true
  } else if (fields.flow[categoryId].isFetchingAll) {
    return false
  } else if (Date.now() - (fields.flow[categoryId].fetchedAllAt || 100) < 100) {
    return false
  }
  return !fields.flow[categoryId].isReceivedAll
}

export const fetchFields = categoryId => {
  return (dispatch, getState) => {
    if (_shouldFetchFields(getState(), categoryId)) {
      return dispatch(_fetchFields(categoryId))
    }
  }
}

export const fetchFieldsIfNeeded = categoryId => {
  return (dispatch, getState) => {
    if (_shouldFetchFieldsIfNeeded(getState(), categoryId)) {
      return dispatch(_fetchFields(categoryId))
    }
  }
}