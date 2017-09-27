import React from 'react';
import Category from '../Category';
import settings from './data/settings';
import fields from './data/fields';
import items from './data/items';

export default class extends Category {
  render = _ => 
    <Category
      category={this.props.category}
      settings={settings}
      fields={fields}
      items={items}/>
}