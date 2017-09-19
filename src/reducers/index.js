import { combineReducers } from 'redux'

import {
  ADD_CLIENT,
} from '../actions'

function clients(state = {}, action) {
  switch (action.type) {
    case ADD_CLIENT :
      return state
    default :
      return state
  }
}

export default combineReducers({
  clients
})