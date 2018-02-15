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

  static fetch = ({mainCollectionId, collectionId='', documentId=''}) =>
    new Promise((resolve, reject) => {
      let ref = database.ref(mainCollectionId)
      if (collectionId) ref = ref.child(collectionId)
      if (documentId) ref = ref.child(documentId)
      ref.once('value').then(snapshot =>
        snapshot.val() ?
          resolve(snapshot.val()) :
          reject(`Attempted to access to ${mainCollectionId}/${collectionId}/${documentId}`)
      )
    })

  static create = ({mainCollectionId, collectionId='', quantity=1, values=null}) =>
    new Promise((resolve, reject) => {
      if (quantity < 1) {
        reject(`Attempted to create on route ${mainCollectionId}/${collectionId}. It must be created at least one item (received ${quantity})`)
        return
      }

      if (!values) {
        reject(`Attempted to create on route ${mainCollectionId}/${collectionId}/ with incorrect values ${values}`)
        return
      }

      const ref = database.ref().child(mainCollectionId)
      let pathCollection = ''
      if (collectionId) {
        pathCollection = `${collectionId}`
      }

      let updates = {}
      let documentIds = []
      for (let i = 0; i < quantity; i++) {
        const documentId = ref.push().key
        documentIds.push(documentId) 
        Object.keys(values).forEach(key => {
          updates[`${pathCollection}/${documentId}/${key}`] = values[key]
        })
      }
      ref.update(updates).then(() => {
        resolve(quantity === 1 ? documentIds[0] : documentIds)
      }).catch(() => {
        reject(quantity === 1 ? 
          `Attempted to create on route ${mainCollectionId}/${pathCollection}/${documentIds[0]}` :
          `Attempted to batch create on route ${mainCollectionId}/${pathCollection}`
        )
      })
    })

  static update = ({mainCollectionId, collectionId='', documentIds=[], values={}}) =>
    new Promise((resolve, reject) => {
      const ref = database.ref().child(mainCollectionId)
      let pathCollection = ''
      if (collectionId) {
        pathCollection = `${collectionId}`
      }

      const isMassive = Array.isArray(documentIds)
    
      if (!values) {
        reject(`Attempted to create on route ${mainCollectionId}/${pathCollection}/ with incorrect values ${values}`)
        return
      }

      if (!documentIds || !documentIds.length || (typeof documentIds !== 'string' && !isMassive)) {
        reject(`Attempted to update on route ${mainCollectionId}/${pathCollection}/ with incorrect document ids ${documentIds}`)
        return
      }
      
      const ids = isMassive ? documentIds : [documentIds]

      let updates = {}
      ids.forEach(documentId => {
        Object.keys(values).forEach(key => {
          updates[`${pathCollection}/${documentId}/${key}`] = values[key]
        })
      })
      ref.update(updates).then(() => {
        resolve(documentIds)
      }).catch(() => {
        reject(isMassive ? 
          `Attempted to batch update on route ${mainCollectionId}/${pathCollection}` :
          `Attempted to update on route ${mainCollectionId}/${pathCollection}/${documentIds}`
        )
      })
    })

  static remove = ({mainCollectionId, collectionId='', documentIds=[]}) =>
    new Promise((resolve, reject) => {
      const ref = database.ref().child(mainCollectionId)
      let pathCollection = ''
      if (collectionId) {
        pathCollection = `${collectionId}`
      }

      const isMassive = Array.isArray(documentIds)

      if (!documentIds || !documentIds.length || (typeof documentIds !== 'string' && !isMassive)) {
        reject(`Attempted to update on route ${mainCollectionId}/${pathCollection}/ with incorrect document ids ${documentIds}`)
        return
      }
      
      const ids = isMassive ? documentIds : [documentIds]

      let updates = {}
      ids.forEach(documentId => {
        updates[`${pathCollection}/${documentId}`] = null
      }) 
      ref.update(updates).then(() => {
        resolve(documentIds)
      }).catch(() => {
        reject(isMassive ? 
          `Attempted to batch remove on route ${mainCollectionId}/${pathCollection}` :
          `Attempted to remove on route ${mainCollectionId}/${pathCollection}/${documentIds}`
        )
      })
    })

}