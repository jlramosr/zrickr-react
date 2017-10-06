var firebase = require("firebase/app");
require("firebase/database");

const config = {
  apiKey: "AIzaSyDoZ6V5LUCN2AZ-DvbDx4S8JoHhBKgIeMw",
  authDomain: "tinyerp-1017.firebaseapp.com",
  databaseURL: "https://tinyerp-1017.firebaseio.com",
  projectId: "tinyerp-1017",
  storageBucket: "tinyerp-1017.appspot.com",
  messagingSenderId: "326927970961"
};

firebase.initializeApp(config);

const database = firebase.database();

//https://ilikekillnerds.com/2017/05/convert-firebase-database-snapshotcollection-array-javascript/
const snapshotToArray = snapshot =>
  Object.entries(snapshot.val()).map(e =>
    Object.assign(e[1], { id: e[0] })
  );

export const getCollection = collection =>
  database.ref(collection).once('value')
    .then( snapshot => snapshotToArray(snapshot))

export const getDocument = (collection, documentId) =>
  database.ref(`${collection}/${documentId}`).once('value')
    .then( snapshot => snapshot.val());

export const addDocument = 
({collection, collectionId='', generateDocumentId=false, documentId='', document}) => {
  const ref = database.ref().child(collection);
  const _collectionId = collectionId ? `${collectionId}/` : '';
  const _documentId = documentId || (generateDocumentId ? ref.push().key : '');
  const path = `${_collectionId}${_documentId}`;
  let updates = {};
  updates[`${path}`] = document;
  ref.update(updates);
}

/*export const addDocumentsId = (collection, collectionId='', newDocumentId='', newDocuments) => {
  const ref = database.ref().child(collection);
  let updates = {};
  if (!Array.isArray(newDocuments)) {
    newDocuments = [newDocuments];
  }
  newDocuments.forEach(newDocument => {
    const newDocumentId = ref.push().key;
    const path = collectionId ? `${collectionId}/${newDocumentId}` : `${newDocumentId}`
    updates[`${path}`] = newDocument;
    ref.update(updates);
  })
}

export const addDocuments = (collection, collectionId, newDocuments) => {
  const ref = database.ref().child(collection);
  let updates = {};
  updates[`${collectionId}`] = newDocuments;
  ref.update(updates);
}*/

const document = {
  "default" : true,
  "label" : "Empresa",
  "name" : "isCompany",
  "type" : "boolean",
  "views" : {
    "overview" : {
      "nolabel" : true,
      "x" : 1,
      "y" : 12,
      "ys" : 1
    }
  }
}
addDocument({
  collection:'categories_fields', collectionId:'clients', documentId:'isCompany', document
});