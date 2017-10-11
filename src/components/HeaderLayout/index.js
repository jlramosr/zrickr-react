import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Operation from './operation';
import { withStyles } from 'material-ui/styles';
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
  },
  leftOperations: {
    order: 1,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  title: {
    order: 2,
    display: 'flex',
    overflow: 'hidden',
  },
  search: {
    order: 3,
    display: 'none',
    flex: 0,
    [theme.breakpoints.up('sm')]: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      marginLeft: 32,
      marginRight: 32,
    },
  },
  miniSearch: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translate(0, -50%)',
    width: '50%',
    zIndex: 5,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  loading: {
    order: 4,
    marginLeft: 8,
    marginRight: 8,
  },
  rightOperations: {
    order: 5,
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('sm')]: {
      flex: 0,
    },
  },
  operations: {
    display: 'flex',
  },
  titleText: {
    marginBottom: 2,
    textTransform: 'capitalize',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  searchBar: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 720,
    background: theme.palette.primary[400],
    width: '100%',
  },
  searchBarSearchIcon: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translate(0, -50%)',
    zIndex: 5,
    paddingLeft: 12,
    paddingRight: 12,
  },
  searchBarInput: {
    flex: 1,
    outline: 'none',
    border: 'none',
    fontSize: 16,
    background: 'transparent',
    paddingLeft: 48,
    paddingRight: 42,
  },
  searchBarInputFocused: {
    background: theme.palette.primary[300],
  },
  searchBarCloseIcon: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translate(0, -50%)',
    paddingRight: 12,
    width: 20,
    height: 20,
    cursor: 'pointer',
  },
  searchBarResults: {
    padding: '0 30px',
    alignContent: 'right',
  },
  searchOperation: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  content: {
    maxWidth: '100%',
    flex: '1 1 100%',
    margin: '0 auto',
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
    {operations.map(operation => 
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
    showMiniSearch: false,
  }

  _openMiniSearch = _ => {
    this.setState({showMiniSearch: !this.state.showMiniSearch});
  }

  _updateSearchQuery = searchQuery => {
    this.setState({searchQuery});
    this.props.updateSearchQuery(searchQuery);
  }

  render = _ => {
    const { operations, title, position, updateSearchQuery, children, classes, loading } = this.props;
    const { searchQuery, showMiniSearch } = this.state;

    return (
      <div className={classes.layout}>
        <AppBar position={position}>
          <Toolbar>

            <div className={classes.leftOperations}>
              {React.createElement(Operations, {
                operations: operations.filter(operation => !operation.right)})
              }
            </div>

            <div className={classes.title}>
              <Typography className={classes.titleText} type="title" color="inherit">
                {title}
              </Typography>
            </div>

            <div className={classes.search}>
            {updateSearchQuery &&
              <div className={classes.searchBar}>
                <Search
                  size={20}
                  color="inherit"
                  className={classes.searchBarSearchIcon}
                />
                <Input
                  classes={{
                    root:classes.searchBarInput,
                    focused:classes.searchBarInputFocused,
                  }}
                  color="contrast"
                  placeholder="Buscar"
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
            </div>

            <div className={classes.loading}>
            {loading &&
              <CircularProgress size={30} color="accent"/>
            }
            </div>

            {updateSearchQuery && showMiniSearch &&
              <div className={classes.miniSearch}>
                <div className={classes.searchBar}>
                  <Search
                    size={20}
                    color="inherit"
                    className={classes.searchBarSearchIcon}
                  />
                  <Input
                    classes={{
                      root:classes.searchBarInput,
                      focused:classes.searchBarInputFocused,
                    }}
                    color="contrast"
                    placeholder="Buscar"
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

            <div className={classes.rightOperations}>
              <div className={classes.searchOperation}>
                <Operation
                  id="search-small"
                  icon={Search}
                  color={showMiniSearch ? 'accent' : 'contrast'}
                  hidden={!updateSearchQuery}
                  onClick={this._openMiniSearch}
                />
              </div>
              {React.createElement(Operations, {
                operations: operations.filter(operation => operation.right)
              })}
            </div>

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
  children: PropTypes.node,
  operations: PropTypes.array,
  title: PropTypes.string,
  position: PropTypes.string.isRequired,
  updateSearchQuery: PropTypes.func,
  loading: PropTypes.bool.isRequired,
};

HeaderLayout.defaultProps = {
  position: 'fixed',
  loading: false,
};

export default withStyles(styles)(HeaderLayout);
