import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Category from '../Category';
import Dashboard from '../Dashboard';
import NotFound from '../NotFound';
import { capitalize } from '../../utils/helpers';
import { getCollection } from '../../utils/api_firebase';
import Drawer from 'material-ui/Drawer';
import { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';

import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  drawerPaper: {
    width: 240,
  },
});

class App extends Component {
  state = {
    categories: [],
    drawerOpen: false,
    loading: true,
  }

  toggleDrawer = _ => {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  componentDidMount = _ => {
    getCollection('categories').then(categories => {
      for (let category of categories) {
        category['icon'] = category.icon ?
          require('material-ui-icons')[category.icon] :
          null
      }
      this.setState({categories, loading: false});
    })
  }

  componentDidCatch(error, info) {
    console.log("ERROR", error, info);
  }

  render = _ => {
    const { categories, drawerOpen, loading} = this.state;
    const { classes } = this.props;

    return (
      <div>

        <Drawer
          type="persistent"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={drawerOpen}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          {
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

        <Route path="/" exact render={ _ => (
          <Dashboard
            loading={loading}
            categories={categories}
            closeDrawer={ _ => this.toggleDrawer()}
          />    
        )}/>
        <Route path="/:categoryName" component={ props => {
          const categoryName = props.match.params.categoryName;
          const category = categories.find(
            category => category.name.toLowerCase() === categoryName.toLowerCase()
          );
          return category ? 
            React.createElement(Category, { 
              category,
              fields: require(`../../categories/${capitalize(category.name)}/fields`).default,
              items: require(`../../categories/${capitalize(category.name)}/items`).default,
            }) : 
            React.createElement(NotFound, {title: 'Not Found'})
        }}/>

      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
