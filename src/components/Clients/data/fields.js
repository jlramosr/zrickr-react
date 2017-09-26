export default [
  {
    "name":"isCompany",
    "type":"boolean",
    "label":"Empresa",
    "views": {
      "overview": {
        "nolabel":true,
        "x":1,"y":12,"ys":1
      }
    } 
  },
  {
    "name":"name",
    "label":"Nombre",
    "primaryInfo": true,
    "views": {
      "overview": {
        "x":2,"y":1,"ys":6,
        "small":{"x":2}
      }
    } 
  },
  {
    "name":"lastname",
    "label":"Apellidos",
    "views": {
      "overview": {
        "x":2,"ys":6,
        "when":"!isCompany",
        "small":{"x":3}
      }
    } 
  },
  {
    "name":"address",
    "label":"Direccion",
    "secondaryInfo": true,
    "views": {
      "overview": {
        "x":3,
        "small":{"x":4}
      }
    }
  },
  {
    "name":"zip",
    "label":"Cod.Postal",
    "views": {
      "overview": {
        "x":4,"y":1,"ys":2,
        "small": {"x":5}
      }
    }
  },
  {
    "name":"city",
    "label":"Ciudad",
    "views": {
      "overview": {
        "x":4,"y":3,"ys":5,
        "small": {"x":6}
      }
    }
  },
  {
    "name":"province",
    "label":"Provincia",
    "views": {
      "overview": {
        "x":4,"y":8,"ys":6,
        "small": {"x":7}
      }
    }
  },
  {
    "name":"phone",
    "label":"Teléfono",
    "views": {
      "overview": {
        "x":5,"y":1,"ys":4,
        "small": {"x":8}
      }
    }
  },
  {
    "name":"email",
    "label":"Email",
    "views": {
      "overview": {
        "x":5,
        "small": {"x":9}
      }
    }
  }
]