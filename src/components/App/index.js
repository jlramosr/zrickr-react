import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Dashboard from '../Dashboard';
import NotFound from '../NotFound';
import categories from './data/categories';
import './index.css';

class App extends Component {
  state = {
    categories: [],
    fields: {},
    drawerOpen: false
  }

  toggleDrawer() {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  componentDidMount() {
    this.setState({categories});
  }

  render() {
    const { categories, drawerOpen } = this.state;

    return (
      <div className="app">
        
        <Drawer
          docked={false}
          width={200}
          open={drawerOpen}
          onRequestChange={drawerOpen => this.setState({drawerOpen})}>{
            categories.map(category => (
              <Link
                key={category.name.toLowerCase()}
                to={`/${category.name.toLowerCase()}`}>
                <MenuItem onClick={ _ => this.toggleDrawer()}>
                  {category.label}
                </MenuItem>
              </Link>
            ))
          }
        </Drawer>

        <div className="app-content">

          <Route path="/" exact render={ _ => (
            <Dashboard categories={categories} closeDrawer={ _ => this.toggleDrawer()}/>
          )}/>

          <Route path="/:categoryName" component={ props => {
            const categoryName = props.match.params.categoryName;
            const category = categories.find(
              category => category.name.toLowerCase() === categoryName.toLowerCase()
            );
            const CategoryComponent = category ? category.component : null;
            return category ?
              React.createElement(CategoryComponent, { category }) :
              React.createElement(NotFound, {title: 'Not Found'})
          }}/>
              
        </div>
      </div>
    );
  }
}

export default App;
