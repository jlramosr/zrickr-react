export default [
  {
    "name":"clientId",
    "type":"number",
    "label":"Cliente",
    "views": {
      "overview": {
        "nolabel":true,
        "x":1,"y":1,"ys":2,
      }
    } 
  },
  {
    "name":"price",
    "type":"number",
    "label":"Precio",
    "default": 0.0,
    "views": {
      "overview": {
        "x":2,"y":1,"ys":3,
      }
    }
  },
  {
    "name":"date",
    "type":"date",
    "label":"Fecha",
    "default": 0.0,
    "views": {
      "overview": {
        "x":2,"y":4,"ys":3,
      }
    }
  },
  {
    "name":"hour",
    "type":"hour",
    "label":"Hora",
    "views": {
      "overview": {
        "x":2,"y":7,"ys":3,
      }
    }
  },
  {
    "name":"charged",
    "type":"boolean",
    "label":"Cobrado",
    "views": {
      "overview": {
        "x":1,"y":12,"ys":1
      }
    }
  }

]