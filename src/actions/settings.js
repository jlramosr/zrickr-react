import API from '../utils/api'

export const RECEIVING_CATEGORY_SETTINGS = 'RECEIVING_CATEGORY_SETTINGS'
export const RECEIVING_CATEGORY_SETTINGS_ERROR = 'RECEIVING_CATEGORY_SETTINGS_ERROR'
export const RECEIVE_CATEGORY_SETTINGS = 'RECEIVE_CATEGORY_SETTINGS'

const _receivingSettingsAction = categoryId => ({
  type: RECEIVING_CATEGORY_SETTINGS,
  fetchedAt: Date.now(),
  categoryId
})

const _errorReceivingSettingsAction = (categoryId, error) => ({
  type: RECEIVING_CATEGORY_SETTINGS_ERROR,
  errorFetching: `${Date.now()} ${error}`,
  categoryId
})

const _receiveSettingsAction = (categoryId, settingsId, settings) => ({
  type: RECEIVE_CATEGORY_SETTINGS,
  receivedAt: Date.now(),
  categoryId,
  settingsId,
  settings
})

const _fetchSettings = categoryId => dispatch => {
  dispatch(_receivingSettingsAction(categoryId))
  const params = {
    mainCollectionId: 'categories_settings',
    collectionId: categoryId
  }
  return API('firebase').fetch(params)
    .then(
      settings => {
        const settingsId = Object.keys(settings)[0]
        const settingsObject = settings[settingsId]
        dispatch(_receiveSettingsAction(categoryId, settingsId, settingsObject || {}))
      },
      error => {
        console.error(`An error occurred fetching settings of ${categoryId}:`, error)
        dispatch(_errorReceivingSettingsAction(categoryId, error))
      }
    )
}

const _shouldFetchSettings = (state, categoryId) => {
  const { settings } = state
  if (settings && settings.flow[categoryId] && settings.flow[categoryId].isFetching) {
    return false
  }
  return true
}

const _shouldFetchSettingsIfNeeded = (state, categoryId) => {
  const { settings } = state
  if (!settings) {
    return true
  } else if (!settings.flow[categoryId]) {
    return true
  } else if (settings.flow[categoryId].isFetching) {
    return false
  } else if (Date.now() - (settings.flow[categoryId].fetchedAt || 100) < 100) {
    return false
  }
  return !settings.flow[categoryId].isReceived
}

export const fetchSettings = categoryId => {
  return (dispatch, getState) => {
    if (_shouldFetchSettings(getState(), categoryId)) {
      return dispatch(_fetchSettings(categoryId))
    }
  }
}

export const fetchSettingsIfNeeded = categoryId => {
  return (dispatch, getState) => {
    if (_shouldFetchSettingsIfNeeded(getState(), categoryId)) {
      return dispatch(_fetchSettings(categoryId))
    }
  }
}