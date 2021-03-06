var dataPath = 'data'

export default class localAPI {

  static getCollection = (collection, collectionId='') => {
    const collectionSplit = collection.split('_')
    return new Promise( resolve => {
      const collection = collectionId ?
        require(`../../${dataPath}/${collectionSplit[0]}/${collectionId}/${collectionSplit[1]}.json`) :
        require(`../../${dataPath}/${collectionSplit[0]}/${collectionSplit[0]}.json`)
      resolve(collection)
    })
  }
  
  static getDocument = (collection, collectionId, documentId='') => {
    const collectionSplit = collection.split('_')
    return new Promise( resolve => {
      const document = documentId ?
        {id: documentId, ...require(`../../${dataPath}/${collectionSplit[0]}/${collectionId}/${collectionSplit[1]}.json`)[documentId]} :
        require(`../../${dataPath}/${collectionSplit[0]}/${collectionId}/${collectionSplit[1]}.json`)
      resolve(document)
    })
  }

}