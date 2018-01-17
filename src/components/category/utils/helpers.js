import { isObject } from '../../../utils/helpers'

const keyPrefixStorage = 'reduxPersist'

export const getItemString = (item, fieldIds=[], fieldsSeparator='') => {
  const info = fieldIds.reduce((info, fieldId) => {
    let value = item ? item[fieldId] : null
    if (localStorage && value) {
      const fieldsStorage = JSON.parse(
        localStorage.getItem(`${keyPrefixStorage}:fields`)
      )
      const allFields = fieldsStorage ? fieldsStorage.byId : {}

      const fields = Object.keys(allFields).reduce((fields, fieldId) => {
        if (fieldIds.includes(fieldId)) {
          return [...fields, allFields[fieldId]]
        }
        return [...fields]
      }, [])

      const field = fields.find(field => field.id === fieldId)

      if (!field || !value) {
        return info
      }

      if (field.relation) {

        const settingsRelationId = JSON.parse(
          localStorage.getItem(`${keyPrefixStorage}:categories`)
        ).byId[`${field.relation}`].settings

        const settings = JSON.parse(
          localStorage.getItem(`${keyPrefixStorage}:settings`)
        ).byId[`${settingsRelationId}`]

        if (!isObject(value)) {
          value = {[value]: true}
        }

        const ids = Object.keys(value)
        const infoRelationTemp = ids.reduce((infoTemp, id) => ([
          ...infoTemp,
          `${getItemString(
            JSON.parse(
              localStorage.getItem(`${keyPrefixStorage}:items`)
            ).byId[`${id}`],
    
            settings.primaryFields,

            settings.primaryFieldsSeparator
          )}`
        ]), [])

        if (!info) {
          return `${infoRelationTemp.join(', ')}`
        }
        
        return `${info} ${fieldsSeparator} ${infoRelationTemp.join(', ')}`
      
      } else if (field.options && localStorage) {

        if (!isObject(value)) {
          value = {[value]: true}
        }

        const ids = Object.keys(value)
        const infoRelationTemp = ids.reduce((infoTemp, id) => {
          const option = field.options.find(option => option.id === id)
          if (option) {
            return [...infoTemp, option.label]
          }
          return [...infoTemp]
        }, [])
        
        if (!info) {
          return `${infoRelationTemp.join(', ')}`
        }

        return `${info} ${fieldsSeparator} ${infoRelationTemp.join(', ')}`

      }
    }

    if (!info && !value) {
      return ''
    }
    if (!info && value) {
      return value
    }
    if (!value) {
      return info
    }
    return `${info} ${fieldsSeparator} ${value}`

  }, '') 
  return info.trim()
}

export const getBackgroundAvatarLetter =  letter => {
  const colors = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', 
    '#f1c40f', '#e67e22', '#e74c3c', '#aaf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
  ]
  return colors[(letter.charCodeAt(0)) % 20]
}