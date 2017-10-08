import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Operation from './operation';
import { withStyles, withTheme } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Input from 'material-ui/Input';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Search from 'material-ui-icons/Search';
import Close from 'material-ui-icons/Close';
import CircularProgress from 'material-ui/Progress/CircularProgress';

const styles = theme => ({
  layout: {
    width: '100%',
    alignItems: 'strecht',
  },
  operations: {
    display: 'flex',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'inherit',
  },
  titleText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: 8,
    marginLeft: 8,
    marginBottom: 2,
  },
  gap: {
    flex: 1,
    display: 'block',
  },
  searchBar: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8,
    background: theme.palette.primary[400],
  },
  searchBarIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 5,
  },
  searchBarInput: {
    flex: 1,
    outline: 'none',
    border: 'none',
    fontSize: 16,
    background: 'transparent',
    color: '#fff',
    paddingLeft: 34,
    paddingRight: 20,
  },
  searchBarInputSingleline: {
  },
  searchBarInputFocused: {
    background: theme.palette.primary[300],
  },
  searchBarCloseIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 7,
    right: 3,
    cursor: 'pointer',
  },
  searchBarResults: {
    padding: '0 30px',
    alignContent: 'right',
  },
  content: {
    paddingTop: theme.standards.toolbarHeights.mobilePortrait,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      paddingTop: theme.standards.toolbarHeights.mobileLandscape,
    },
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.standards.toolbarHeights.tabletDesktop,
    },    
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
        description={operation.description}
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

class HeaderLayout extends Component {
  state = {
    searchQuery: '',
  }

  _updateSearchQuery = searchQuery => {
    this.setState({searchQuery});
    this.props.updateSearchQuery(searchQuery);
  }

  render = _ => {
    const { operations, title, position, updateSearchQuery, loading, children, classes } = this.props;
    const { searchQuery } = this.state;

    return (
      <div className={classes.layout}>
        <AppBar position={position}>
          <Toolbar>

            {React.createElement(Operations, {
              operations: operations.filter(operation => !operation.right)})
            }

            <div className={classes.title}>
              <Typography className={classes.titleText} type="title" color="inherit">
                {title}
              </Typography>
              {loading &&
                <CircularProgress color="accent"/>
              }
            </div>

            <div className={classes.gap}></div>

            {updateSearchQuery &&
              <div className={classes.searchBar}>
                <Search
                  size={20}
                  color="inherit"
                  className={classes.searchBarIcon}
                />
                <Input
                  classes={{
                    root:classes.searchBarInput,
                    underline:classes.searchBarInputSingleline,
                    focused:classes.searchBarInputFocused,
                  }}
                  disableUnderline
                  value={searchQuery}
                  onChange={ event => this._updateSearchQuery(event.target.value) }
                />
                {searchQuery && 
                  <Close
                    size={20}
                    color="inherit"
                    className={classes.searchBarCloseIcon}
                    onClick={ event => this._updateSearchQuery('')}
                  />
                }
              </div>
            }

            {/*
              <div className={classes.searchBarResults} hidden={
                !(searchQuery && showingItems.length !== 0 && showingItems.length !== items.length)
              }>
                {`Mostrando ${showingItems.length} resultados`}
              </div>
              <div className={classes.searchBarResults} hidden={
                !(searchQuery && showingItems.length === 0)
              }>
                No se han encontrado coincidencias
              </div>
            */}

            {React.createElement(Operations, {
              operations: operations.filter(operation => operation.right)})
            }

          </Toolbar>
        </AppBar>

        <div className={classes.content}>
          {children}
        </div>
        
      </div>
    )
  }
};

HeaderLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  children: PropTypes.node,
  operations: PropTypes.array,
  title: PropTypes.string,
  position: PropTypes.string.isRequired,
  updateSearchQuery: PropTypes.func,
  loading: PropTypes.bool.isRequired,
};

HeaderLayout.defaultProps = {
  position: 'fixed',
  loading: true,
};

export default withTheme(withStyles(styles)(HeaderLayout));
