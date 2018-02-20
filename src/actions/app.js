export const SETTING_AUTH_USER = 'SETTING_AUTH_USER'
export const SET_AUTH_USER = 'SET_AUTH_USER'

const applySettingAuthUser = () => ({
  type: SETTING_AUTH_USER
})

const applySetAuthUser = authUser => ({
  type: SET_AUTH_USER,
  authUser
})

export const setAuthUser = authUser => dispatch => {
  dispatch(applySetAuthUser(authUser))
}

export const settingAuthUser = () => dispatch => {
  dispatch(applySettingAuthUser())
}