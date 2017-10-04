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

export const getAll = table => {
  return database.ref(table).once('value')
    .then( snapshot => {
      let all = [];
      snapshot.forEach( register => all.push(register.val()) )
      return all;
    })
    .then(data => data);
}

export const add = (table, newRecord) => {
  const ref = database.ref(table);
  const newRegisterKey = database.ref().child(table).push().key;
  let updates = {};
  updates[`/${table}/${newRegisterKey}`] = newRecord;
  database().ref().update(updates);
}