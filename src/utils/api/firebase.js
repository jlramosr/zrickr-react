const firebase = require('firebase/app')
require('firebase/database')

const config = {
  apiKey: 'AIzaSyDoZ6V5LUCN2AZ-DvbDx4S8JoHhBKgIeMw',
  authDomain: 'tinyerp-1017.firebaseapp.com',
  databaseURL: 'https://tinyerp-1017.firebaseio.com',
  projectId: 'tinyerp-1017',
  storageBucket: 'tinyerp-1017.appspot.com',
  messagingSenderId: '326927970961'
}

firebase.initializeApp(config)

const database = firebase.database()

export default class firebaseAPI {

  static fetch =
  ({mainCollectionId, collectionId='', documentId=''}) => {
    let ref = database.ref(mainCollectionId)
    if (collectionId) ref = ref.child(collectionId)
    if (documentId) ref = ref.child(documentId)
    return new Promise((resolve, reject) => {
      ref.once('value').then(snapshot =>
        snapshot.val() ?
          resolve(snapshot.val()) :
          reject(`Attempted to access to ${mainCollectionId}/${collectionId}/${documentId}`)
      )
    })
  }

  static update = 
  ({mainCollectionId, collectionId='', isNew=false, isMassive=false, documentId='', documentIds=[], values}) => {
    const ref = database.ref().child(mainCollectionId)
    let pathCollection = ''
    if (collectionId){
      pathCollection = `${collectionId}/`
    }

    return new Promise((resolve, reject) => {

      if (!isMassive && !isNew && (!documentId || typeof documentId !== 'string')) {
        reject(`Attempted to access to ${mainCollectionId}/${pathCollection}/ with incorrect documentId: ${documentId}`)
        return
      }
      if (isMassive && (!documentIds || !Array.isArray(documentIds) || !documentIds.length)) {
        reject(`Attempted to access to ${mainCollectionId}/${pathCollection}/ with incorrect documentIds: ${documentIds}`)
        return
      }

      if (!isMassive) {
        let pathDocument = ''
        let updates = {}
        if (isNew) {
          pathDocument = ref.push().key
        } else if (!isMassive) {
          pathDocument = documentId
        }
        updates[`${pathCollection}${pathDocument}`] = values
        ref.update(updates).then(() => {
          resolve(pathDocument)
        }).catch(() => {
          reject(`Attempted to access to ${mainCollectionId}/${pathCollection}/${documentId}`)
        })

      } else {
        let sets = {}
        documentIds.forEach(documentId => {
          sets[`${pathCollection}${documentId}`] = values
        })
        ref.set(sets).then(() => {
          resolve(documentIds)
        }).catch(() => {
          reject(`Attempted to access to ${mainCollectionId}/${pathCollection}/${documentId}`)
        })
      }

    })
  }
}