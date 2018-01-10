export const getItemString = (fieldNames=[], item) => {
  const info = fieldNames
    .reduce((info, currentField) => 
      info + (item[currentField] ? item[currentField] : '') + ' ', '')
  return info.trim()
}

export const getBackgroundAvatarLetter =  letter => {
  const colors = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', 
    '#f1c40f', '#e67e22', '#e74c3c', '#aaf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
  ]
  return colors[(letter.charCodeAt(0)) % 20]
}