import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CategoryList from './list';
import ItemOverview from './overview';
import './index.css';


class Category extends Component {
  state = {
    items: []
  }

  componentDidMount() {
    this.setState({
      items: [
        {id:'1', name:'Amazon'},
        {id:'2', name:'Google'}
      ]
    })
  }

  render() {
    const { items } = this.state;
    const { category } = this.props;

    return (

      <div className="category">

        <Route path={`/${category.name}`} exact render={ _ => (
          <CategoryList items={items} category={category}/>
        )}/>

        <Route path={`/${category.name}/:id`} render={ props => {
          const itemId = props.match.params.id;
          const item = items.filter( item => item.id === itemId)[0];
          return React.createElement(ItemOverview, { item, category });
        }}/>

      </div>
    );
  }
}

export default Category;
