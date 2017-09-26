import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CategoryList from './list';
import ItemOverview from './overview';


class Category extends Component {
  state = {
  }

  componentDidMount() {
  }

  render() {
    const { category, fields, items } = this.props;

    const primaryFields = fields.filter(field => field.primaryInfo);
    const secondaryFields = fields.filter(field => field.secondaryInfo);

    const primaryField = primaryFields.length ? primaryFields[0].name : '';
    const secondaryField = secondaryFields.length ? secondaryFields[0].name : '';

    return (
      <div>

        <Route path={`/${category.name}`} exact render={ _ => (
          React.createElement(CategoryList, { category, items, fields, primaryField, secondaryField })
        )}/>

        <Route path={`/${category.name}/:id`} render={ props => {
          const itemId = props.match.params.id;
          const item = items.filter(it => it.id === itemId)[0] || {};
          return React.createElement(ItemOverview, { category, item, fields, primaryField });
        }}/>

      </div>
    );
  }
}

export default Category;
