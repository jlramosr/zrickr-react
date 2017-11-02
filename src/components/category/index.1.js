import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import API from '../../utils/api';
import CategoryList from './list';
import CategoryItemOverview from './detail';

class Category extends Component {
  state = {
    settings: {},
    fields: [],
    items: [],
    loading: true,
  }

  _getData = _ => {
    Promise.all([
      API('local').getDocument('categories_settings', this.props.id),
      API('local').getCollection('categories_fields', this.props.id),
      API('local').getCollection('categories_items', this.props.id),
    ])
      .then(values => {
        const [settings, fields, items] = values;
        const icon = settings.icon;
        settings['icon'] = icon  ?
          (typeof icon === 'string' ? require('material-ui-icons')[icon] : icon) : 
          null
        this.setState({settings, fields, items, loading: false});
      })
      .catch(error => {
        console.log("ERROR PIDIENDO DATOS CATEGORIA", error);
      })
  }

  componentDidMount = _ => {
    this._getData();
  }

  render = _ => {
    const { settings, fields, items, loading } = this.state;
    const { id, label } = this.props;

    return (
      <div>

        <Route path={`/${id}`} exact render={ props => (
          React.createElement(CategoryList, {
            categoryId: id,
            categoryLabel: label,
            settings,
            items,
            loading,
            fields: fields
              .filter(field => field.views.list)
              .sort((a, b) => (a.views.list.y < b.views.list.y ? -1 : 1)),
          })
        )}/>

        <Route path={`/${id}/:itemId`} render={ props => {
          const itemId = props.match.params.itemId;
          return React.createElement(CategoryItemOverview, {
            id: itemId.toString(),
            categoryId: id,
            settings,
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
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default Category;
