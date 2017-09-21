import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CategoryList from './list';
import ItemOverview from './overview';
import './index.css';


class Category extends Component {
  state = {
  }

  componentDidMount() {
  }

  render() {
    const { category, fields, items } = this.props;

    return (

      <div className="category">

        <Route path={`/${category.name}`} exact render={ _ => (
          React.createElement(CategoryList, { category, items, fields })
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
