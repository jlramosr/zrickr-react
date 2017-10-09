var dataPath = 'data';

export const getCollection = (collection, collectionId) => {
  const collectionSplit = collection.split('_');
  return new Promise( resolve => {
    if (collectionId) {
      resolve(
        require(`../${dataPath}/${collectionSplit[0]}/${collectionId}/${collectionSplit[1]}.json`)
      )
    } else {
      resolve(
        require(`../${dataPath}/${collectionSplit[0]}/${collectionSplit[0]}.json`)
      )
    }
  });
}

export const getDocument = (collection, documentId) => {
  const collectionSplit = collection.split('_');
  return new Promise( resolve => resolve(
    require(`../${dataPath}/${collectionSplit[0]}/${documentId}/${collectionSplit[1]}.json`))
  );
}

export const add = (table, newRecord) => {}