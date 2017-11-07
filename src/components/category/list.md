CategoryList example:

```js static
<CategoryList
  categoryId='example'
  categoryLabel='example'
  fields={[
    'name':{
      'label':'Nombre',
      'required':true,
      'views':{
        'detail':{
          'x':2,'y':1,'ys':6,
          'small':{'x':2}
        },
        'list':{
          'y':2, 'ys':3
        }
      }
    },
    'lastname':{
      'label':'Apellidos',
      'description':'Apellidos del individuo',
      'default':'POR DEFECTO',
      'views':{
        'detail':{
          'x':2,
          'ys':6,
          'when':'!this.isCompany',
          'nodescription':true,
          'small':{
            'x':3,
            'when':'!this.isCompany'
          }
        },
        'list':{
          'y':1
        } 
      }
    }
  ]}
/>
```