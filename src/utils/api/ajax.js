const api = "http://romeo-hesch:3001/api/v1.0"

let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token,
}

export default class ajaxAPI {

  static getCollection = (collection) =>
    fetch(`${api}/${collection}`, { headers })
      .then(response => response.json())

  static getDocument = (collection, documentId) =>
    fetch(`${api}/${collection}/${documentId}`, { headers })
      .then(res => res.json())
      .then(data => data)

  /*static update = (book, shelf) =>
    fetch(`${api}/books/${book.id}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ shelf })
    }).then(res => res.json())

  static search = (query, maxResults) =>
    fetch(`${api}/search`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, maxResults })
    }).then(res => res.json())
      .then(data => data.books)*/
  
}