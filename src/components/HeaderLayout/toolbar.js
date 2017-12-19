import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Operation from './operation'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Input from 'material-ui/Input'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Search from 'material-ui-icons/Search'
import Close from 'material-ui-icons/Close'
import CircularProgress from 'material-ui/Progress/CircularProgress'

const appBarStyle = {
  width: '-webkit-fill-available'
}

const toolbarStyle = {
  justifyContent: 'center'
}

const secondaryProperties = {
  height: 30
}

const styles = theme => ({
  /* Bar */
  normalAppBar: {
    ...appBarStyle
  },
  secondaryAppBar: {
    ...appBarStyle,
    height: secondaryProperties.height,
    background: theme.palette.primary[200]
  },
  normalToolbar: {
    ...toolbarStyle
  },
  secondaryToolbar: {
    ...toolbarStyle,
    minHeight: secondaryProperties.height
  },

  /* Operations and Content */
  leftOperations: {
    
  },
  content: {
    display: 'flex',
    overflow: 'hidden',
    flex: 1
  },
  rightOperations: {

  },

  /* Content */
  title: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: theme.spacing.unit*4
  },
  search: {
    display: 'none',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      marginLeft: theme.spacing.unit*2,
      marginRight: theme.spacing.unit*2
    }
  },
  operations: {
    display: 'flex'
  },

  /* Title */
  titleText: {
    flex: 1,
    marginBottom: 2,
    fontWeight: 400,
    textTransform: 'capitalize',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  progress: {
    margin: `0 ${theme.spacing.unit}px`
  },

  /* Search */
  searchBar: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 620,
    background: theme.palette.primary[400],
    width: '100%'
  },
  searchBarSearchIcon: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translate(0, -50%)',
    zIndex: 5,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  searchBarInput: {
    flex: 1,
    outline: 'none',
    border: 'none',
    fontSize: 16,
    background: 'transparent',
    paddingLeft: theme.spacing.unit*5,
    paddingRight: theme.spacing.unit*4
  },
  searchBarInputFocused: {
    background: theme.palette.primary[300]
  },
  searchBarCloseIcon: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translate(0, -50%)',
    paddingRight: theme.spacing.unit,
    width: 20,
    height: 20,
    cursor: 'pointer'
  },
  searchOperation: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  }
})

let Operations = props => {
  const { operations, color, classes } = props

  return (
    <div className={classes.operations}>
      {operations.map(operation => 
        <Operation key={operation.id} color={color} {...operation} />
      )}
    </div>
  )
}

Operations.propTypes = {
  classes: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired
}

Operations = withStyles(styles)(Operations)

class CustomToolbar extends Component {
  state = {
    searchQuery: ''
  }

  _updateSearchQuery = searchQuery => {
    this.setState({searchQuery})
    this.props.updateSearchQuery(searchQuery)
  }

  render = () => {
    const {
      title,
      operations,
      updateSearchQuery,
      customContent,
      secondary,
      loading,
      classes,
      theme 
    } = this.props
    const { searchQuery } = this.state

    const leftOperations = operations.filter(operation => !operation.right)
    let rightOperations = operations.filter(operation => operation.right)

    if (updateSearchQuery) {
      rightOperations = [
        {id:'search-small', icon:Search, right:true, onClick: () => {}},//TODO}},
        ...rightOperations
      ]
    }
    
    return (
      <AppBar
        position="static"
        className={secondary ? classes.secondaryAppBar : classes.normalAppBar}
      >
        <Toolbar className={secondary ? classes.secondaryToolbar : classes.normalAppBar}>

          <div className={classes.leftOperations}>
            <Operations operations={leftOperations} color="contrast"/>
          </div>

          <div className={classes.content}>
            {customContent !== undefined && customContent}
            {customContent === undefined &&
              <React.Fragment>
                <div className={classes.title}>
                  <Typography
                    className={classes.titleText}
                    type={secondary ? 'subheading' : 'title'}
                    color={secondary ? 'contrast' : 'inherit'}
                  >
                    {title}
                  </Typography>
                  {loading &&
                    <div className={classes.progress}>
                      <CircularProgress size={20} thickness={7} color="accent" />
                    </div>
                  }
                </div>

                {updateSearchQuery &&
                  <div className={classes.search}>
                    <div className={classes.searchBar}>
                      <Search size={20} className={classes.searchBarSearchIcon}/>
                      <Input
                        classes={{
                          root: classes.searchBarInput,
                          focused: classes.searchBarInputFocused   
                        }}
                        color="contrast"
                        placeholder="Buscar"
                        disableUnderline={secondary ? false : true}
                        value={searchQuery}
                        onChange={event => this._updateSearchQuery(event.target.value)}
                      />
                      {searchQuery && 
                        <Close
                          size={20}
                          color={secondary ? theme.palette.primary[600] : theme.palette.primary[900]}
                          className={classes.searchBarCloseIcon}
                          onClick={ () => this._updateSearchQuery('')}
                        />
                      }
                    </div>
                  </div>
                }
              </React.Fragment>
            }
          </div>

          <div className={classes.rightOperations}>
            <Operations operations={rightOperations} color="contrast" />
          </div>

        </Toolbar>
      </AppBar>
    )
  }
}

CustomToolbar.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  title: PropTypes.string,
  updateSearchQuery: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  secondary: PropTypes.bool
}

CustomToolbar.defaultProps = {
  loading: false,
  secondary: false
}

export default withStyles(styles, {withTheme: true})(CustomToolbar)
