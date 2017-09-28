import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CategoryList from './list';
import ItemOverview from './overview';

class Category extends Component {
  state = {
    prevPath: ''
  }

  render() {
    const { category, settings, fields, items } = this.props;
    const { prevPath } = this.state;

    return (
      <div>

        <Route path={`/${category.name}`} exact render={ _ => (
          React.createElement(CategoryList, { category, settings, items, fields })
        )}/>

        <Route path={`/${category.name}/:id`} render={ props => {
          const itemId = props.match.params.id;
          const item = items.filter(it => it.id === itemId)[0] || {};
          return React.createElement(
            ItemOverview, { category, settings, item, fields, prevPath });
        }}/>

      </div>
    );
  }
}

export default Category;
