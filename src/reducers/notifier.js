import { NOTIFY } from '../actions/notifier'

const initialNotificationState = {
  message: '',
  type: ''
}

const notifier = (state = initialNotificationState, action) => {
  switch (action.type) {
    case NOTIFY:
      return {
        ...state,
        message: action.notificationMessage,
        type: action.notificationType
      }
    default:
      return state
  }
}

export default notifier