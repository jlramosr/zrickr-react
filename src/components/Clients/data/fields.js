export default [
  {
    "name":"name",
    "primaryInfo": true,
    "label":"Nombre",
    "formView": {
      "x": 2,
      "y": 1
    }
  },
  {
    "name":"lastname",
    "label":"Apellidos",
    "formView": {
      "colStart": 11,
      "cols": 2,
      "colEnd": 13,
      "rowStart": 2,
    }
  },
  {
    "name":"address",
    "label":"Direccion",
    "secondaryInfo": true,
    "formView": {
      "colStart": 9,
      "cols": 1,
      "rowStart": 1,
      "rows": 8
    }
  },
  {
    "name":"isCompany",
    "type":"boolean",
    "label":"Empresa",
    "formView": {
      "x": 6,
      "y": 3,
      "xs": 1,
      "ys": 1
    }
  },
  {
    "name":"name2",
    "primaryInfo": true,
    "label":"Nombre",
    "formView": {
      "x": 2,
      "y": 6,
    }
  },
  {
    "name":"lastname2",
    "label":"Apellidos",
    "formView": {
      "colStart": 11,
      "cols": 2,
      "colEnd": 13,
      "rowStart": 2,
    }
  },
  {
    "name":"address2",
    "label":"Direccion",
    "secondaryInfo": true,
    "formView": {
      "colStart": 9,
      "cols": 1,
      "rowStart": 1,
      "rows": 8
    }
  },
  {
    "name":"isCompany2",
    "type":"boolean",
    "label":"Empresa",
    "formView": {
      "y": 2,
      "ys": 2
    }
  }
]


/*[
  {name: "name", type: "string", label: "Nombre", icon: "domain", readOnly: true, required: true,
  formView: { showIcon: false, rowStart: 5, cols: 2 } 
},
{name: "address", type: "string", label: "Direccion", icon: "place", required: true,
  formView: { rowStart: 2, showLabel: false } 
},
{name: "nif", type: "string", label: "NIF",
  formView: { rowStart: 8} 
},
{name: "contact", type: "string", label: "Contacto", 
  formView: { rowStart: 9} 
},
{name: "type", type: "select", label: "Tipo",
  formView: { rowStart: 10} 
},
{name: "notes", type: "text", label: "Notas",
  formView: { rowStart: 11, rows: 3} 
},
{name: "address2", type: "string", label: "Direccion2",
  formView: { rowStart: 3, cols: 2, colStart: 7 } 
},
{name: "phone", type: "string", label: "Telefono", icon: "local-phone",
  formView: { tab: "facturacion", rowStart: 3, rows: 2, colStart: 3, cols: 3} 
},
{name: "email", type: "string", label: "Email", icon: "local-post-office",
  formView: { tab:"facturacion", rowStart: 2} 
},
{name: "dontshow", type: "number", label: "Don\"t Show",
  formView: false 
},
{name: "tab", type: "tab", label: "Facturación", 
  tabs: [{name: "facturacion", label: "Facturación"}, {name: "historial", label: "Historial"}],
  formView: { rowStart: 8, rowEnd: 13, cols: 6, colStart: 1} 
}
]*/