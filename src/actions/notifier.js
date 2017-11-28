export const NOTIFY = 'NOTIFY'

export const notify = (message, type) => ({
  type: NOTIFY,
  notificationMessage: message,
  notificationType: type
})