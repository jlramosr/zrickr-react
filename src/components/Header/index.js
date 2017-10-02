import React from 'react';
import PropTypes from 'prop-types';
import Operation from './operation';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CircularProgress from 'material-ui/Progress/CircularProgress';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.mixins.toolbar.minHeight,
  },

  title: {
    flex: 1,
    display: 'flex',
    height: '100%',
    alignItems: 'center',
  },

  titleText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: 8,
    marginBottom: 2,
  },

  operations: {
    display: 'flex',
  },

});

let Operations = props => {
  const { operations, classes } = props;

  return (
    <div className={classes.operations}>
      {operations && operations.map(operation => 
        <Operation
          key={operation.id}
          id={operation.id}
          icon={operation.icon}
          hidden={operation.hidden}
          to={operation.to}
          onClick={operation.onClick}
        />
      )}
    </div>
  )
};

Operations.propTypes = {
  classes: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
};

Operations = withStyles(styles)(Operations);

const Header = props => {
  const { classes, operations, title, position, loading } = props;
  const _loading = loading || false;

  return (
    <div className={classes.root}>
      <AppBar position={position}>
        <Toolbar>
          {
            React.createElement(Operations, {
              operations: operations.filter(operation => !operation.right)})
          }
          <div className={classes.title}>
            <Typography className={classes.titleText} type="title" color="inherit">
              {title}
            </Typography>
            <CircularProgress/>
          </div>
          {
            React.createElement(Operations, {
              operations: operations.filter(operation => operation.right)})
          }
        </Toolbar>
      </AppBar>
    </div>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
};

Header.defaultProps = {
  position: 'fixed',
};

export default withStyles(styles)(Header);
