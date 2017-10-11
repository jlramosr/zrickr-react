import { snapshotToArray } from '../helpers';

var dataPath = 'data';

export default class localAPI {

  static getCollection = (collection, collectionId) => {
    const collectionSplit = collection.split('_');
    return new Promise( resolve => {
      const collection = collectionId ?
        require(`../../${dataPath}/${collectionSplit[0]}/${collectionId}/${collectionSplit[1]}.json`) :
        require(`../../${dataPath}/${collectionSplit[0]}/${collectionSplit[0]}.json`)
      resolve(snapshotToArray(collection));
    });
  }
  
  static getDocument = (collection, documentId1, documentId2) => {
    const collectionSplit = collection.split('_');
    return new Promise( resolve => {
      const document = documentId2 ?
        require(`../../${dataPath}/${collectionSplit[0]}/${documentId1}/${collectionSplit[1]}.json`)[documentId2] :
        require(`../../${dataPath}/${collectionSplit[0]}/${documentId1}/${collectionSplit[1]}.json`)
      resolve(document);
    });
  }

}