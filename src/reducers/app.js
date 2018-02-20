import { SETTING_AUTH_USER } from '../actions/app'
import { SET_AUTH_USER } from '../actions/app'

const initialAppState = {
  name: process.env.REACT_APP_NAME,
  categoriesPath: 'section',
  session: {
    user: null,
    token: null,
    isSetting: true
  }
}

const app = (state = initialAppState, action) => {

  switch (action.type) {
    case SETTING_AUTH_USER: 
      return {
        ...state,
        session: {
          ...state.session,
          isSetting: true
        }
      }
    case SET_AUTH_USER: {
      return {
        ...state,
        session: {
          ...state.session,
          user: action.authUser,
          token: action.token,
          isSetting: false
        }
      }
    }
    default:
      return state
  }
}

export default app