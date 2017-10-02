export default [
  {
    "name":"isCompany",
    "type":"boolean",
    "label":"Empresa",
    "default": true,
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
    "required": true,
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
    "default": "POR DEFECTO",
    "views": {
      "overview": {
        "x":2,
        "ys":6,
        "when":"!this.isCompany",
        "small": {
          "x":3,
          "when":"!this.isCompany"
        }
      }
    } 
  },
  {
    "name":"address",
    "label":"Direccion",
    "description": "Dirección fiscal de la empresa/individuo",
    "views": {
      "overview": {
        "x":3,
        "nodescription": true,
        "small":{"x":4}
      }
    }
  },
  {
    "name":"zip",
    "label":"Cod.Postal",
    "type": "number",
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
    "type":"select",
    "items": [
      {"id": "madrid", "label": "Madrid"},
      {"id": "barcelona", "label": "Bacelona"}
    ],
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
  },
  {
    "name": "movements",
    "type": "list",
    "relation": "movements",
    "views": {
      "overview": {
        "x": 6,
        "small": {"x":10}
      }
    }
  },
  {
    "name": "description",
    "label": "Descripción",
    "type": "text",
    "views": {
      "overview": {
        "x": 7, "xs":3, "ys": 10,
        "small": {"x":11}
      }
    }
  },
  {
    "name": "edad",
    "label": "Edad",
    "type": "number",
    "views": {
      "overview": {
        "x": 7, "ys": 2,
        "small": {"x":12}
      }
    }
  },
  {
    "name": "raza",
    "label": "Raza",
    "views": {
      "overview": {
        "x": 8, "ys": 2,
        "small": {"x":13}
      }
    }
  },
  {
    "name": "religion",
    "label": "Religión",
    "type": "select",
    "items": [
      {"id": "catolica", "label": "Católica"},
      {"id": "musulmana", "label": "Musulmana"},
      {"id": "budista", "label": "Budista"},
    ],
    "views": {
      "overview": {
        "x": 9, "ys": 2,
        "small": {"x":14}
      }
    }
  },
  {
    "name": "cliente_asociado",
    "label": "Cliente Asociado",
    "type": "select",
    "relation": "clients",
    "views": {
      "overview": {
        "x": 10,
        "small": {"x":15}
      }
    }
  },
]