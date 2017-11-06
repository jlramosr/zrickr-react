import API from '../utils/api'

export const REQUEST_CATEGORY_SETTINGS = 'REQUEST_CATEGORY_SETTINGS'
export const RECEIVE_CATEGORY_SETTINGS = 'RECEIVE_CATEGORY_SETTINGS'

export const requestSettings = categoryId => ({
  type: REQUEST_CATEGORY_SETTINGS,
  fetchingAt: Date.now(),
  categoryId
})

export const receiveSettings = (categoryId, settingsId, settings) => ({
  type: RECEIVE_CATEGORY_SETTINGS,
  receivedAt: Date.now(),
  categoryId,
  settingsId,
  settings
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
      error => console.log('ERROR PIDIENDO SETTINGS', error)
    )
}