import API from '../utils/api'

export const SET_AUTH_USER = 'SET_AUTH_USER'

const _setAuthUser = authUser => ({
  type: SET_AUTH_USER,
  authUser
})

export const setAuthUser = () => dispatch => {
  //dispatch(_receivingCategoriesAction())
  return API(process.env.REACT_APP_AUTH_SOURCE).getUser()
    .then(
      authUser => {
        dispatch(_setAuthUser(authUser))
      },
      error => {
        console.error('An error occurred setting auth user:', error)
        //dispatch(_errorReceivingCategoriesAction(error))
      }
    )
}

