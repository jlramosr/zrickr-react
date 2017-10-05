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

export const addNew = (collection, newDocument) => {
  const ref = database.ref().child(collection);
  const newDocumentId = ref.push().key;
  let updates = {};
  updates[`${newDocumentId}`] = newDocument;
  ref.update(updates);
}

export const addDocument = (collection, collectionId, newDocument) => {
  const ref = database.ref().child(collection);
  let updates = {};
  updates[`${collectionId}`] = newDocument;
  ref.update(updates);
}

/*addDocument('categories_settings', '-KvboYj33C3djwkBU3Kj', {
  "primaryFields": ['name', 'lastname'],
  "secondaryFields": ['address'],
  "color": "#ddd",
  "itemLabel": 'Cliente',
})*/