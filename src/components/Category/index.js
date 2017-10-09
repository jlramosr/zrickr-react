import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCollection } from '../../utils/api_firebase';
import { getDocument } from '../../utils/api_local';
import CategoryList from './list';
import ItemOverview from './overview';

class Category extends Component {
  state = {
    settings: {},
    fields: [],
    loading: true,
  }

  componentDidMount = _ => {
    getDocument('categories_settings', this.props.category.id).then(settings => {
      getCollection('categories_fields', this.props.category.id).then(fields => {
        this.setState({settings, fields, loading: false});
      });
    });
  }

  render = _ => {
    const { settings, fields, loading } = this.state;
    const { category, items } = this.props;

    return (
      <div>

        <Route path={`/${category.name}`} exact render={ props => (
          React.createElement(CategoryList, {
            category,
            settings,
            items,
            loading,
            fields: fields
              .filter(field => field.views.list)
              .sort((a, b) => (a.views.list.y < b.views.list.y ? -1 : 1)),
          })
        )}/>

        <Route path={`/${category.name}/:id`} render={ props => {
          const itemId = props.match.params.id;
          const item = items.find(it => it.id === itemId);
          return React.createElement(ItemOverview, {
            category,
            settings,
            item,
            loading,
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
  items: PropTypes.array.isRequired,
}

export default Category;
