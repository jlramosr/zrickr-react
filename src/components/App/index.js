import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Dashboard from '../Dashboard';
import NotFound from '../NotFound';
import categories from './data/categories';
import Drawer from 'material-ui/Drawer';
import Menu, { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import { withTheme, withStyles } from 'material-ui/styles';

const styles = theme => ({
  drawerPaper: {
    width: 240,
  },
});

class App extends Component {
  state = {
    categories: [],
    drawerOpen: false,
  }

  toggleDrawer = _ => {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  componentDidMount = _ => {
    this.setState({categories});
  }

  render() {
    const { categories, drawerOpen} = this.state;
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
            categories={categories}
            closeDrawer={ _ => this.toggleDrawer()}
          />    
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
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
