import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Operation from './operation'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Input from 'material-ui/Input'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Search from 'material-ui-icons/Search'
import FindInPage from 'material-ui-icons/FindInPage'
import Close from 'material-ui-icons/Close'
import Reply from 'material-ui-icons/Reply'
import CircularProgress from 'material-ui/Progress/CircularProgress'
import { transformColor } from './utils/helpers'

const sizeDifferenceLimit = 'sm'

const styles = theme => ({
  /* Bar */
  appBar: {
    width: '-webkit-fill-available'
  },
  toolbar: {
    justifyContent: 'center'
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
    height: '100%',
    [theme.breakpoints.up(sizeDifferenceLimit)]: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 0,
    top: theme.spacing.unit*1.5,
    left: theme.spacing.unit*2,
    opacity: 0,
    zIndex: theme.zIndex.appBar+1,
    maxWidth: `calc(100% - ${theme.spacing.unit*10}px)`,
    transition: theme.transitions.create(['background-color', 'opacity', 'max-width', 'width'], {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.sharp
    })
  },
  searchBarSearchIcon: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translate(0, -50%)',
    zIndex: 5,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    width: 20,
    height: 20
  },
  searchBarInput: {
    flex: 1,
    outline: 'none',
    border: 'none',
    fontSize: 14,
    paddingLeft: theme.spacing.unit*5,
    paddingRight: theme.spacing.unit*4
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
    [theme.breakpoints.up(sizeDifferenceLimit)]: {
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
    searchQuery: '',
    showSearchInput: false,
    searchInputFocused: false,
    smallMode: false
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.onResize)
    this.updateSmallMode(this.props.theme)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onResize)
  }

  onResize = () => {
    this.updateSmallMode(this.props.theme)
  }

  updateSmallMode = theme => {
    const width = window.innerWidth
    if (width >= theme.breakpoints.width(sizeDifferenceLimit)) {
      this.setState({smallMode: false, showSearchInput: true})
    } else {
      this.setState({smallMode: true, showSearchInput: false})
    }
  }

  updateSearchQuery = searchQuery => {
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
      secondaryProps,
      loading,
      classes,
      theme 
    } = this.props
    const { showSearchInput, searchQuery, searchInputFocused, smallMode } = this.state

    let appBarComputedStyle = {}
    let toolbarComputedStyle = {}
    let contentComputedStyle = {
      color: 'white'
    }
    let searchBarComputedStyle = {    
      backgroundColor: transformColor(theme.palette.primary[500], searchInputFocused ? 24 : 16)
    }

    /* WHEN SEARCH APPEARS */
    if (showSearchInput) {
      if (smallMode) {
        searchBarComputedStyle = {
          ...searchBarComputedStyle,
          width: '100%',
          opacity: 1
        }
      } else {
        searchBarComputedStyle = {
          ...searchBarComputedStyle,
          position: 'relative',
          top: 0,
          left: 0,
          opacity: 1,
          width: searchInputFocused ? '100%' : '90%',
          maxWidth: searchInputFocused ? 300 : 240
        }
      }
    }


    /* OPERATIONS */
    const leftOperations = operations.filter(operation => !operation.right)
    let rightOperations = operations.filter(operation => operation.right)

    /* IS SECONDARY TOOLBAR */
    if (secondary && secondaryProps) {
      appBarComputedStyle = {
        ...appBarComputedStyle,
        height: secondaryProps.height,
        background: theme.palette[secondaryProps.color][secondaryProps.tone]
      }
      toolbarComputedStyle = {
        ...toolbarComputedStyle,
        minHeight: secondaryProps.height,
        paddingLeft: theme.spacing.unit * (leftOperations.filter(op => !op.hidden).length ? 1 : 3),
        paddingRight: theme.spacing.unit * (rightOperations.filter(op => !op.hidden).length ? 1 : 3)
      }
      contentComputedStyle = {
        ...contentComputedStyle,
        marginBottom: 0,
        color: theme.palette[secondaryProps.fontColor][secondaryProps.fontTone]
      }
      searchBarComputedStyle = {
        ...searchBarComputedStyle,
        top: smallMode ? theme.spacing.unit/2 : 0,
        left: smallMode ? theme.spacing.unit*2 : 0,
        backgroundColor: theme.palette[secondaryProps.color][secondaryProps.tone]  
      }
    }

    /* SEARCH ICON IN SMALL MODE */
    if (updateSearchQuery && smallMode) {
      if (showSearchInput) {
        rightOperations = [
          {
            id:'undo',
            icon:Reply,
            color:contentComputedStyle.color,
            right:true,
            onClick:() => {
              this.setState({showSearchInput: false, searchQuery: ''})
              updateSearchQuery('')
            }
          }
        ]
      } else {
        rightOperations = [
          {
            id:'search-small',
            icon:secondary ? FindInPage : Search,
            color:contentComputedStyle.color,
            right:true,
            onClick:() => this.setState({showSearchInput: true})
          },
          ...rightOperations
        ]
      }
    }
    
    return (
      <AppBar position="static" className={classes.appBar} style={appBarComputedStyle}>
        <Toolbar className={classes.appBar} style={toolbarComputedStyle}>

          <div className={classes.leftOperations}>
            <Operations operations={leftOperations} color={contentComputedStyle.color} />
          </div>

          <div className={classes.content}>
            {customContent !== undefined && customContent}
            {customContent === undefined &&
              <React.Fragment>
                {title &&
                  <div className={classes.title}>
                    <Typography
                      color="inherit"
                      className={classes.titleText}
                      style={contentComputedStyle}
                      type={secondary ? 'subheading' : 'title'}
                    >
                      {title}
                    </Typography>
                    {loading &&
                      <div className={classes.progress}>
                        <CircularProgress size={20} thickness={7} color="accent" />
                      </div>
                    }
                  </div>
                }

                {updateSearchQuery && 
                  <div className={classes.search}>
                    <div className={classes.searchBar} style={searchBarComputedStyle}>
                      <Search
                        className={classes.searchBarSearchIcon}
                        style={contentComputedStyle}
                      />
                      <Input
                        classes={{
                          root: classes.searchBarInput
                        }}
                        style={contentComputedStyle}
                        onFocus={() => this.setState({searchInputFocused: true})}
                        onBlur={() => this.setState({searchInputFocused: false})}
                        placeholder="Buscar"
                        disableUnderline={secondary ? false : true}
                        value={searchQuery}
                        onChange={event => this.updateSearchQuery(event.target.value)}
                      />
                      {searchQuery && 
                        <Close
                          size={20}
                          className={classes.searchBarCloseIcon}
                          style={contentComputedStyle}
                          onClick={ () => this.updateSearchQuery('')}
                        />
                      }
                    </div>
                  </div>
                }
              </React.Fragment>
            }
          </div>

          <div className={classes.rightOperations}>
            <Operations operations={rightOperations} color={contentComputedStyle.color} />
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
