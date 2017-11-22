import API from '../utils/api'

export const REQUEST_CATEGORY_SETTINGS = 'REQUEST_CATEGORY_SETTINGS'
export const RECEIVE_CATEGORY_SETTINGS = 'RECEIVE_CATEGORY_SETTINGS'
export const REQUEST_CATEGORY_SETTINGS_ERROR = 'REQUEST_CATEGORY_SETTINGS_ERROR'


export const requestSettings = categoryId => ({
  type: REQUEST_CATEGORY_SETTINGS,
  fetchedAllAt: Date.now(),
  categoryId
})

export const receiveSettings = (categoryId, settingsId, settings) => ({
  type: RECEIVE_CATEGORY_SETTINGS,
  receivedAllAt: Date.now(),
  categoryId,
  settingsId,
  settings
})

export const errorFetchingSettings = (categoryId, error) => ({
  type: REQUEST_CATEGORY_SETTINGS_ERROR,
  errorFetchingAll: `${Date.now()} ${error}`,
  categoryId
})

export const fetchSettings = categoryId => dispatch => {
  dispatch(requestSettings(categoryId))
  return API('firebase').getCollection('categories_settings', categoryId)
    .then(
      settings => {
        const settingsId = Object.keys(settings)[0]
        const settingsObject = settings[settingsId]
        dispatch(receiveSettings(categoryId, settingsId, settingsObject || {}))
      },
      error => {
        console.error(`An error occurred fetching settings of ${categoryId}:`, error)
        dispatch(errorFetchingSettings(categoryId, error))
      }
    )
}

export const shouldFetchSettings = (state, categoryId) => {
  const { categories, settings } = state
  if (!categories) {
    return true
  } else if (!settings) {
    return true
  } else if (!categories.byId[categoryId]) {
    return true
  } else if (!categories.byId[categoryId].settings) {
    return true
  } else if (settings.flow[categoryId].isFetchingAll) {
    return false
  }
  return !settings.flow[categoryId].isReceivedAll
}

export const fetchSettingsIfNeeded = categoryId => {
  return (dispatch, getState) => {
    if (shouldFetchSettings(getState(), categoryId)) {
      return dispatch(fetchSettings(categoryId))
    }
  }
}