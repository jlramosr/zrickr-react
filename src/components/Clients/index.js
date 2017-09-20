import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CategoryList from './list';
import ItemOverview from './overview';
import './index.css';


class Category extends Component {
  state = {
    fields: [],
    items: []
  }

  componentDidMount() {
    this.setState({
      fields: [
        {name:'name', primaryInfo: true, label:'Nombre', type:'input'},
        {name:'address', label:'Direccion', type:'input'},
        {name:'type', secondaryInfo: true, label:'Tipo', type:'select', options:[
            {name:'particular', label:'Particular'},
            {name:'company', label:'Company'}
          ]
        }
      ],
      items: [
        { id: '11231', primaryInfo:'Amazon', secondaryInfo: 'Company', address: 'C/Federico' }, 
        { id: '24124', primaryInfo:'Google', secondaryInfo: 'Company', address: 'C/Magnolias' }
      ]
    })
  }

  render() {
    const { fields, items } = this.state;
    const { category } = this.props;

    return (

      <div className="category">

        <Route path={`/${category.name}`} exact render={ _ => (
          React.createElement(CategoryList, { category, fields })
        )}/>

        <Route path={`/${category.name}/:id`} render={ props => {
          const itemId = props.match.params.id;
          const item = items.filter(it => it.id === itemId)[0] || {};
          return React.createElement(ItemOverview, { category, item, fields });
        }}/>

      </div>
    );
  }
}

export default Category;
