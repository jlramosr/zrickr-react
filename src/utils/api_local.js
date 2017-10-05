var dataPath = 'data';

export const getCollection = collection => 
  new Promise( resolve => resolve(
    require(`../${dataPath}/${collection}/${collection}.json`))
  );

export const getDocument = (collection, documentId) => {
  const collectionSplit = collection.split('_');
  return new Promise( resolve => resolve(
    require(`../${dataPath}/${collectionSplit[0]}/${documentId}/${collectionSplit[1]}.json`))
  );
}

export const add = (table, newRecord) => {}