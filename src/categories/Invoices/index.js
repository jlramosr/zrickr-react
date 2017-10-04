import React, {Component} from 'react';
import Category from '../../components/Category';
import settings from './data/settings';
import fields from './data/fields';
import items from './data/items';

export default class extends Component {
  render = _ => 
    <Category
      category={this.props.category}
      settings={settings}
      fields={fields}
      items={items}
    />
}