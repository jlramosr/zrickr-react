export const getItemString = (fieldNames=[], item) => {
  const info = fieldNames
    .reduce((info, currentField) => 
      info + (item[currentField] ? item[currentField] : '') + ' ', '')
  return info.trim()
}