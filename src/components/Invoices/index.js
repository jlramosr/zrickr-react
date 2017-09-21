import React from 'react';
import Category from '../Category';
import fields from './data/fields';
import items from './data/items';

export default class extends Category {
  render = _ => 
    <Category category={this.props.category} fields={fields} items={items}/>
}