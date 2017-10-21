import { TOGGLE_DRAWER } from '../actions/drawer'

const initialDrawerState = {
  opened: false
}

const drawer = (state = initialDrawerState, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return {
        ...state,
        opened: action.opened,
      }
    default:
      return state
  }
}

export default drawer