import API from '../utils/api'

export const REQUEST_CATEGORY_SETTINGS = 'REQUEST_CATEGORY_SETTINGS'
export const RECEIVE_CATEGORY_SETTINGS = 'RECEIVE_CATEGORY_SETTINGS'
export const REQUEST_CATEGORY_SETTINGS_ERROR = 'REQUEST_CATEGORY_SETTINGS_ERROR'


export const requestSettings = categoryId => ({
  type: REQUEST_CATEGORY_SETTINGS,
  fetchedAt: Date.now(),
  categoryId
})

export const receiveSettings = (categoryId, settingsId, settings) => ({
  type: RECEIVE_CATEGORY_SETTINGS,
  receivedAt: Date.now(),
  categoryId,
  settingsId,
  settings
})

export const errorFetchingSettings = (categoryId, error) => ({
  type: REQUEST_CATEGORY_SETTINGS_ERROR,
  errorFetching: `${Date.now()} ${error}`,
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