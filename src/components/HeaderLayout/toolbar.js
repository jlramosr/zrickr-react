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
  root: {
    width: '-webkit-fill-available',
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
    marginRight: theme.spacing.unit*4,
  },
  search: {
    order: 3,
    display: 'none',
    flex: 0,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      marginLeft: theme.spacing.unit*4,
      marginRight: theme.spacing.unit*4,
    },
  },
  rightOperations: {
    order: 4,
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
  miniSearch: {
    position: 'absolute',
    left: theme.spacing.unit*2,
    top: '50%',
    transform: 'translate(0, -50%)',
    width: '50%',
    zIndex: 5,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
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
    maxWidth: 520,
    background: theme.palette.primary[400],
    width: '100%',
  },
  searchBarSearchIcon: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translate(0, -50%)',
    zIndex: 5,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  searchBarInput: {
    flex: 1,
    outline: 'none',
    border: 'none',
    fontSize: 16,
    background: 'transparent',
    paddingLeft: theme.spacing.unit*5,
    paddingRight: theme.spacing.unit*4,
  },
  searchBarInputFocused: {
    background: theme.palette.primary[300],
  },
  searchBarInputFocusedMiniToolbar: {
    background: theme.palette.secondary[700],
  },
  searchBarCloseIcon: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translate(0, -50%)',
    paddingRight: theme.spacing.unit,
    width: 20,
    height: 20,
    cursor: 'pointer',
  },
  searchOperation: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
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

class CustomToolbar extends Component {
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
    const { operations, title, updateSearchQuery, classes, theme, miniToolbar, loading } = this.props;
    const { searchQuery, showMiniSearch } = this.state;

    const miniToolbarHeight = 40;

    return (
      <AppBar
        className={classes.root}
        style={
          miniToolbar ? {
            height: miniToolbarHeight,
            background: theme.palette.secondary[700],
          } : {
          }
        }
        position="static"
      >
        <Toolbar style={
          miniToolbar ? {
            minHeight: miniToolbarHeight
          } : { 
        }}>

          <div className={classes.leftOperations}>
            {React.createElement(Operations, {
              operations: operations.filter(operation => !operation.right)
            })}
          </div>

          <div className={classes.title}>
            <Typography
              className={classes.titleText}
              type={miniToolbar ? "subheading" : "title"}
              color="inherit"
            >
              {title}
            </Typography>
          </div>

          <div
            className={classes.search}
            style={miniToolbar ? {justifyContent: 'flex-end'}: {}}
          >
          {updateSearchQuery &&
            <div
              className={classes.searchBar}
              style={miniToolbar ? {background: theme.palette.secondary[700]}: {}}
            >
              <Search
                size={20}
                color="contrast"
                className={classes.searchBarSearchIcon}
              />
              <Input
                classes={{
                  root:classes.searchBarInput,
                  focused: miniToolbar ? 
                    classes.searchBarInputFocusedMiniToolbar : 
                    classes.searchBarInputFocused,
                }}
                color="contrast"
                placeholder="Buscar"
                disableUnderline={miniToolbar ? false : true}
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
                  disableUnderline={miniToolbar}
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

          <div className={classes.rightOperations}>
            <div className={classes.loading}>
            {loading &&
              <CircularProgress size={30} color="accent"/>
            }
            </div>
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
    )
  }
};

CustomToolbar.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  operations: PropTypes.array,
  title: PropTypes.string,
  updateSearchQuery: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  miniToolbar: PropTypes.bool,
};

CustomToolbar.defaultProps = {
  loading: false,
  miniToolbar: false,
};

export default withStyles(styles, {withTheme: true})(CustomToolbar);
