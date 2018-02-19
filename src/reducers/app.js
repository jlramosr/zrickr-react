import { SET_AUTH_USER } from '../actions/app'

const initialAppState = {
  name: process.env.REACT_APP_NAME,
  categoriesPath: 'section',
  authUser: null
}

const app = (state = initialAppState, action) => {

  switch (action.type) {
    case SET_AUTH_USER: 
      return {
        ...state,
        authUser: action.authUser
      }
    default:
      return state
  }
}

export default app