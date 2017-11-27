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
  ({collection, collectionId='', documentId=''}) => {
    let ref = database.ref(collection)
    if (collectionId) ref = ref.child(collectionId)
    if (documentId) ref = ref.child(documentId)
    return new Promise((resolve, reject) => {
      ref.once('value').then(snapshot =>
        snapshot.val() ?
          resolve(snapshot.val()) :
          reject(`Attempted to access to ${collection}/${collectionId}/${documentId}`)
      )
    })
  }

  static update = 
  ({collection, collectionId='', generateDocumentId=false, documentId='', document}) => {
    const ref = database.ref().child(collection)
    const _collectionId = collectionId ? `${collectionId}/` : ''
    const _documentId = documentId || (generateDocumentId ? ref.push().key : '')
    const path = `${_collectionId}${_documentId}`
    return new Promise((resolve, reject) => {
      let updates = {}
      if (path) {
        updates[`${path}`] = document
      }
      ref.update(Object.keys(updates).length ? updates : document).then(() => {
        resolve(_documentId)
      }).catch(() => {
        reject(`Attempted to access to ${collection}/${_collectionId}/${_documentId}`)
      })
    })
  }
}