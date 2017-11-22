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

  static getCollection = (collection, collectionId, documentId) => {
    let ref = database.ref(collection)
    if (collectionId) ref = ref.child(collectionId)
    if (documentId) ref = ref.child(documentId)
    return new Promise((resolve, reject) => {
      ref.once('value').then( snapshot =>
        snapshot.val() ?
          resolve(snapshot.val()) :
          reject(`Attempted to access to ${collection}/${collectionId}`)
      )
    })
  }

  static getDocument = (collection, collectionId, documentId='') => {
    let ref = database.ref(collection).child(collectionId)
    if (documentId) ref = ref.child(documentId)
    return ref.once('value')
      .then( snapshot => snapshot.val())
  }

  static updateCollection = 
  ({collection, collectionId='', generateDocumentId=false, documentId='', document}) => {
    const ref = database.ref().child(collection)
    const _collectionId = collectionId ? `${collectionId}/` : ''
    const _documentId = documentId || (generateDocumentId ? ref.push().key : '')
    const path = `${_collectionId}${_documentId}`
    if (path) {
      let updates = {}
      updates[`${path}`] = document
      ref.update(updates)
    }
    else {
      ref.update(document)
    }
  }

  /*static addDocumentsId = (collection, collectionId='', newDocumentId='', newDocuments) => {
    const ref = database.ref().child(collection)
    let updates = {}
    if (!Array.isArray(newDocuments)) {
      newDocuments = [newDocuments]
    }
    newDocuments.forEach(newDocument => {
      const newDocumentId = ref.push().key
      const path = collectionId ? `${collectionId}/${newDocumentId}` : `${newDocumentId}`
      updates[`${path}`] = newDocument
      ref.update(updates)
    })
  }

  static addDocuments = (collection, collectionId, newDocuments) => {
    const ref = database.ref().child(collection)
    let updates = {}
    updates[`${collectionId}`] = newDocuments
    ref.update(updates)
  }*/

}

/*const document = {
  "isCompany": {
    "type":"boolean",
    "label":"Empresa",
    "default": true,
    "views": {
      "detail": {
        "nolabel":true,
        "x":1,"y":12,"ys":1
      }
    }
  },
  "name": {
    "label":"Nombre",
    "required": true,
    "views": {
      "detail": {
        "x":2,"y":1,"ys":6,
        "small":{"x":2}
      },
      "list": {
        "y":1
      }
    }
  },
  "lastname": {
    "label":"Apellidos",
    "default": "POR DEFECTO",
    "views": {
      "detail": {
        "x":2,
        "ys":6,
        "when":"!this.isCompany",
        "small": {
          "x":3,
          "when":"!this.isCompany"
        }
      },
      "list": {
        "y":2
      } 
    }
  },
  "address": {
    "label":"Direccion",
    "description": "Dirección fiscal de la empresa/individuo",
    "views": {
      "detail": {
        "x":3,
        "nodescription": true,
        "small":{"x":4}
      }
    }
  },
  "zip": {
    "label":"Cod.Postal",
    "type": "number",
    "views": {
      "detail": {
        "x":4,"y":3,"ys":5,
        "small": {"x":5}
      },
      "list": {
        "y":3
      }
    }
  },
  "city": {
    "label":"Ciudad",
    "type":"select",
    "items": [
      {"id": "madrid", "label": "Madrid"},
      {"id": "barcelona", "label": "Bacelona"}
    ],
    "views": {
      "detail": {
        "x":4,"y":1,"ys":2,
        "small": {"x":6}
      },
      "list": {
        "y":4
      }
    }
  },
  "province": {
    "label":"Provincia",
    "views": {
      "detail": {
        "x":4,"y":8,"ys":6,
        "small": {"x":7}
      },
      "list": {
        "y":5
      }
    }
  },
  "phone": {
    "label":"Teléfono",
    "views": {
      "detail": {
        "x":5,"y":1,"ys":4,
        "small": {"x":8}
      },
      "list": {
        "y":6
      }
    }
  },
  "email": {
    "label":"Email",
    "views": {
      "detail": {
        "x":5,
        "small": {"x":9}
      },
      "list": {
        "y":7
      }
    }
  },
  "movements": {
    "type": "list",
    "relation": "movements",
    "views": {
      "detail": {
        "x": 6,
        "small": {"x":10}
      },
      "list": {
        "y":8
      }
    }
  },
  "description": {
    "label": "Descripción",
    "type": "text",
    "views": {
      "detail": {
        "x": 7, "xs":3, "ys": 10,
        "small": {"x":11}
      },
      "list": {
        "y":9
      }
    }
  },
  "edad": {
    "label": "Edad",
    "type": "number",
    "views": {
      "detail": {
        "x": 7, "ys": 2,
        "small": {"x":12}
      },
      "list": {
        "y":10
      }
    }
  },
  "raza": {
    "label": "Raza",
    "views": {
      "detail": {
        "x": 8, "ys": 2,
        "small": {"x":13}
      }
    }
  },
  "religion": {
    "label": "Religión",
    "type": "select",
    "items": [
      {"id": "catolica", "label": "Católica"},
      {"id": "musulmana", "label": "Musulmana"},
      {"id": "budista", "label": "Budista"},
    ],
    "views": {
      "detail": {
        "x": 9, "ys": 2,
        "small": {"x":14}
      }
    }
  },
  "cliente_asociado": {
    "label": "Cliente Asociado",
    "type": "select",
    "relation": "clients",
    "views": {
      "detail": {
        "x": 10,
        "small": {"x":15}
      }
    }
  },
}
updateCollection({
  collection:'categories_fields', collectionId: 'clients', document
})*/