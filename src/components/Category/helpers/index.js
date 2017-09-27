export function getInfo(fields, item) {
  const fieldNames = fields ? fields : []
  const info = fieldNames
    .reduce((accumulator, currentField) => 
      accumulator + (item[currentField] ? item[currentField] : '') + ' ', '')
  return info.trim();
}