export const capitalize = str => str.length
  ? str[0].toUpperCase() + str.slice(1).toLowerCase()
  : ''

//https://ilikekillnerds.com/2017/05/convert-firebase-database-snapshotcollection-array-javascript/
export const snapshotToArray = snapshot =>
  Object.entries(snapshot).map(e => ({...e[1], id: e[0]}) )

export const isEqual = (item1, item2) => {
  return JSON.stringify(item1) === JSON.stringify(item2) 
}

export const isObject = value =>
  value && typeof value === 'object' && !Array.isArray(value)

export const getDifferences = (item1, item2) => {
  let _item1 = {...item1}
  let diffs = Object.keys(item2).reduce((differences, key) => {
    const valItem1 = item1[key]
    const valItem2 = item2[key]
    delete _item1[key]
    if (JSON.stringify(valItem1) !== JSON.stringify(valItem2)) {
      return {...differences, [key]:valItem2}
    } 
    return differences
  }, {})
  return Object.keys(_item1).reduce((differences, key) => (
    {...diffs, [key]:null}
  ), diffs)
}

export const getInfo = (fieldNames=[], item) => {
  const info = fieldNames
    .reduce((accumulator, currentField) => 
      accumulator + (item[currentField] ? item[currentField] : '') + ' ', '')
  return info.trim()
}