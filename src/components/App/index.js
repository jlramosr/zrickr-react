import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Category from '../Category';
import Dashboard from '../Dashboard';
import NotFound from '../NotFound';
import { fetchCategories } from '../../actions';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';

const styles = {
  menuItem: {
    textTransform: 'capitalize',
  }
}

class App extends Component {
  state = {
    categories: [],
    drawerOpen: false,
    loading: true,
  }

  toggleDrawer = _ => this.setState({drawerOpen: !this.state.drawerOpen});

  componentDidMount = _ => this.props.fetchCategories();

  componentWillReceiveProps = props => this.setState({categories: props.categories});

  render = _ => {
    const { classes } = this.props;
    const { drawerOpen, categories, loading} = this.state;

    return (
      <div>
        
        <Drawer type="persistent" open={drawerOpen}>
          <div>
            <IconButton onClick={this.toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/${category.id}`}>
              <MenuItem className={classes.menuItem} onClick={ _ => this.toggleDrawer()}>
                {category.label}
              </MenuItem>
            </Link>
          ))}
        </Drawer>

        <Route path="/" exact component={props => (
          <Dashboard
            categories={categories}
            loading={loading}
            closeDrawer={this.toggleDrawer}
          />    
        )}/>
        <Route path="/:categoryId" component={ props => {
          const categoryId = props.match.params.categoryId;
          console.log(categoryId);
          const category = categories.find(
            category => category.id === categoryId
          );
          return category ? 
            React.createElement(Category, { 
              id: categoryId,
              label: category.label,
            }) : 
            React.createElement(NotFound, {title: 'Not Found'})
        }}/>

      </div>
    );
  }
}

const mapStateToProps = ({categories}) => ({
  categories: Object.keys(categories).reduce((cats, categoryId) =>
    [...cats, { id: categoryId, ...categories[categoryId] }]
  ,[])
})

const mapDispatchToProps = dispatch => {
  return {
    fetchCategories: _ => dispatch(fetchCategories()),
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default
  connect(mapStateToProps,mapDispatchToProps)(
    withStyles(styles)(App)
  );
