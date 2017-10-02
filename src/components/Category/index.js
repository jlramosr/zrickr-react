import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CategoryList from './list';
import ItemOverview from './overview';

class Category extends Component {
  render() {
    const { category, settings, fields, items } = this.props;

    return (
      <div>

        <Route path={`/${category.name}`} exact render={ props => (
          React.createElement(CategoryList, { 
            category, settings, items, fields, history:props.history
          })
        )}/>

        <Route path={`/${category.name}/:id`} render={ props => {
          const itemId = props.match.params.id;
          const item = items.find(it => it.id === itemId);
          return React.createElement(ItemOverview, {
            category, settings, item, fields
          });
        }}/>

      </div>
    );
  }
}

Category.defaultProps = {
  category: PropTypes.object.isRequired,
  settings: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
}

export default Category;
