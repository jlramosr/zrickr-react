import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CategoryList from './list';
import ItemOverview from './overview';

class Category extends Component {
  render = _ => {
    const { category, settings, fields, items } = this.props;

    return (
      <div>

        <Route path={`/${category.name}`} exact render={ props => (
          React.createElement(CategoryList, { 
            category,
            settings,
            items,
            fields: fields
              .filter(field => field.views.list)
              .sort((a, b) => (a.views.list.y < b.views.list.y ? -1 : 1)),
            history: props.history
          })
        )}/>

        <Route path={`/${category.name}/:id`} render={ props => {
          const itemId = props.match.params.id;
          const item = items.find(it => it.id === itemId);
          return React.createElement(ItemOverview, {
            category,
            settings,
            item,
            fields: fields
              .filter(field => field.views.overview)
              .sort((a, b) => (
                a.views.overview.x < b.views.overview.x ? -1 : (
                  (a.views.overview.x === b.views.overview.x) &&
                  (a.views.overview.y < b.views.overview.y) ? -1 : 1
                ))
              ),
          });
        }}/>

      </div>
    );
  }
}

Category.propTypes = {
  category: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
}

export default Category;
