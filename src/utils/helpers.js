export const capitalize = (string='') => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

//https://ilikekillnerds.com/2017/05/convert-firebase-database-snapshotcollection-array-javascript/
export const snapshotToArray = snapshot =>
  Object.entries(snapshot).map(e => ({...e[1], id: e[0]}) )

export const getInfo = (fieldNames=[], item) => {
  const info = fieldNames
    .reduce((accumulator, currentField) => 
      accumulator + (item[currentField] ? item[currentField] : '') + ' ', '')
  return info.trim()
}