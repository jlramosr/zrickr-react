import localAPI from './local'
import ajaxAPI from './ajax'
import firebaseAPI from './firebase'

export default (api='local') => {
  switch (api) {
    case 'ajax': 
      return {
        getCollection:ajaxAPI.getCollection,
        getDocument:ajaxAPI.getDocument,
      };
    case 'firebase': 
      return {
        getCollection:firebaseAPI.getCollection,
        getDocument:firebaseAPI.getDocument,
      };
    default: 
      return {
        getCollection: localAPI.getCollection,
        getDocument: localAPI.getDocument,
      }
  }
}