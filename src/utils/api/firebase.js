const firebase = require('firebase/app')
require('firebase/database')
require('firebase/auth')

const enviroment = process.env
const {
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_PROJECT_ID,
  REACT_APP_DATABASE_URL,
  REACT_APP_STORAGE_URL,
  REACT_APP_MESSAGING_SENDER_ID
} = enviroment

const config = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  databaseURL: REACT_APP_DATABASE_URL,
  storageBucket: REACT_APP_STORAGE_URL,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID
}

firebase.initializeApp(config)

const database = firebase.database()
const auth = firebase.auth()

export default class firebaseAPI {

  static getUser = () => {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(user => {
        resolve(user)
      })
    })
  }

  static createUserWithPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

  static signInWithPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password)

  static signInWithProvider = providerName => {
    let provider = auth.GoogleAuthProvider()
    if (providerName === 'google') {
      provider = auth.GoogleAuthProvider()
    }
    return new Promise((resolve, reject) => {
      auth.signInWithPopup(provider).then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken
        // The signed-in user info.
        const user = result.user
        resolve({user, token})
        // ...
      }).catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.email
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential
        reject({errorCode, errorMessage, email, credential})
      })
    })
  }

  static signOut = () =>
    auth.signOut()

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