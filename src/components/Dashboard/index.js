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
  const { theme, classes, categories, closeDrawer } = props;

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




/*const listStyle = {
  padding: "10px", 
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center"	
}

const itemStyle = {
  width: "200px",
  height: "58px",
  color: "#00838F",
  borderRadius: "5px",
  background: "#fff",
  margin: "20px",
  fontSize: "18px",
  fontWeight: "300",
  boxShadow: "1px 2px 1px 0px #888"
}

const avatarStyle = {
  background:"transparent"
}*/

/*

        <Header title="ERP" operations={[
          {id:'menu', icon: Menu, onClick:closeDrawer}
        ]}/>

        <List style={listStyle}> {
          categories && categories.map(category =>
            <Link
              key={category.name.toLowerCase()}
              to={`/${category.name.toLowerCase()}`}>
              <ListItem button style={itemStyle}>
                <Avatar style={avatarStyle}>
                  <Icon>{React.createElement(category.icon)}</Icon>
                </Avatar>
                <ListItemText primary={category.label} secondary="Jan 9, 2016" />
              </ListItem>
            </Link>
          )
        }</List>

*/