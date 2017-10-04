import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../Header';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';
import MenuIcon from 'material-ui-icons/Menu';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  primaryText: {
    background: theme.palette.background.primary,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.primary[100],
  },
});

const Dashboard = props => {
  const { categories, closeDrawer } = props;

  return (
    <div>
      <Header title="ERP" operations={[
        {id:'menu', icon: MenuIcon, onClick:closeDrawer},
      ]}/>
      <List>
        {
          categories && categories.map(category =>
            <Link
              key={category.name.toLowerCase()}
              to={`/${category.name.toLowerCase()}`}>
              <ListItem button>
                <Avatar>
                  <Icon>{React.createElement(category.icon)}</Icon>
                </Avatar>
                <ListItemText primary={category.label}/>
              </ListItem>
            </Link>
          )
        }
      </List>
    </div>
  )
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  closeDrawer: PropTypes.func
};

export default withStyles(styles)(Dashboard);