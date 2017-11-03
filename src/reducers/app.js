export const CHANGE_CONNECTION_STATUS = 'CHANGE_CONNECTION_STATUS'

const initialAppState = {
  name: 'ERP',
  isConnected: false
}

const app = (state = initialAppState, action) => {
  switch (action.type) {
    case CHANGE_CONNECTION_STATUS:
      return {
        ...state,
        isConnected: action.isConnected
      }
    default:
      return state
  }
}

export default app