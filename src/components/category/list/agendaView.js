import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import RemoveCircle from 'material-ui-icons/RemoveCircle'
import Reply from 'material-ui-icons/Reply'
import MoreVert from 'material-ui-icons/MoreVert'
import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
import Delete from 'material-ui-icons/Delete'
import { getItemString, getBackgroundAvatarLetter } from './../utils/helpers'
import Menu from './../../menu'
import { withStyles } from 'material-ui/styles'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const styles = theme => ({
  padding: {
    paddingTop: 0,
    paddingBottom: 0,
    [`${theme.breakpoints.up('sm')}`]: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit*2,
      paddingRight: theme.spacing.unit*2
    },
    [`${theme.breakpoints.up('md')}`]: {
      paddingBottom: theme.spacing.unit*3,
      paddingLeft: theme.spacing.unit*4,
      paddingRight: theme.spacing.unit*4
    },
    [`${theme.breakpoints.up('lg')}`]: {
      paddingLeft: theme.spacing.unit*8,
      paddingRight: theme.spacing.unit*8
    }
  },
  dense: {
    padding: theme.spacing.unit/2
  },
  itemText: {
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  itemTextContent: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  unmarkedItem: {
    background: theme.palette.white,
    transition: theme.transitions.create('background', {
      easing: theme.transitions.easing.easeOut,
      duration: 600
    })
  },
  markAddedItem: {
    background: theme.palette.success.light,
    opacity: 0.95
  },
  markRemovedItem: {
    background: theme.palette.error.light,
    opacity: 0.9,
    transition: theme.transitions.create(['opacity','background'], {
      easing: theme.transitions.easing.easeOut,
      duration: 600
    })
  },
  animationEnter: {
    opacity: 0.01,
    background: theme.palette.white,
    transform: 'translate(-10em, 0)'
  },
  animationEnterActive: {
    opacity: 1,
    background: theme.palette.success.light,
    transform: 'translate(0,0)', 
    transition: theme.transitions.create(['background','transform','opacity'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.standard
    })
  },
  animationLeaveRelation: {
    background: theme.palette.error.light,
    opacity: 1
  },
  animationLeaveRelationActive: {
    opacity: 0.01,
    transition: theme.transitions.create('opacity', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.standard
    })
  },
  animationLeave: {
    transform: 'translate(0, 0)'
  },
  animationLeaveActive: {
    transform: 'translate(-20em, 0)',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.ease,
      duration: theme.transitions.duration.complex
    })
  },
  animationAppear: {
    transform: 'translate(0, -10em)'
  },
  animationAppearActive: {
    transform: 'translate(0,0)',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter
    })
  }
})

let CategoryAgendaView = class extends Component {
  state = {
    showMenuItem: false,
    itemMenuClickedId: null,
    anchorEl: null,
    isSearching: false
  }

  componentWillReceiveProps = nextProps => {
    this.setState({isSearching: 
      this.props.searchQuery !== nextProps.searchQuery
    })
  }

  itemClick(event, itemId) {
    const { relationMode, dialogMode, openDetailDialog, markAddItems } = this.props
    if (relationMode) {
      event.preventDefault()
      openDetailDialog(itemId)
    } else if (dialogMode) {
      event.preventDefault()
      markAddItems([itemId])
    }
  }

  handleMenuItemClick = (event, itemId) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ showMenuItem: true, anchorEl: event.currentTarget, itemMenuClickedId: itemId })
  }

  handleMenuItemClose = () => {
    this.setState({ showMenuItem: false, anchorEl: null, itemMenuClickedId: null })
  }

  render = () => {
    const {
      categoryId,
      settings,
      items,
      showAvatar,
      dialogMode,
      relationMode,
      editMode,
      onRemoveItem,
      history,
      toAddIds,
      toRemoveIds,
      markRemoveItems,
      unmarkRemoveItems,
      classes
    } = this.props
    const {showMenuItem, anchorEl, itemMenuClickedId } = this.state

    return (
      <React.Fragment>
        <List
          classes={{
            padding: classes.padding,
            dense: classes.dense
          }}
          dense={relationMode || dialogMode}
        >
          <ReactCSSTransitionGroup
            transitionName={{
              enter: classes.animationEnter,
              enterActive: classes.animationEnterActive,
              leave: relationMode ? classes.animationLeaveRelation : classes.animationLeave,
              leaveActive: relationMode ? classes.animationLeaveRelationActive : classes.animationLeaveActive,
              appear: classes.animationAppear,
              appearActive: classes.animationAppearActive
            }}
            transitionEnter={relationMode && !this.state.isSearching}
            transitionEnterTimeout={300}
            transitionLeave={!this.state.isSearching}
            transitionLeaveTimeout={300}
            transitionAppear={relationMode}
            transitionAppearTimeout={200}
          >
            {items.map(item => {
              const isMarkedForAdd = toAddIds ? toAddIds.includes(item.id) : false
              const isMarkedForRemove = toRemoveIds ? toRemoveIds.includes(item.id) : false
              const itemClassName = classes[
                isMarkedForRemove ? 'markRemovedItem' : (isMarkedForAdd ? 'markAddedItem' : 'unmarkedItem')
              ]
              const primaryInfo = getItemString(item, settings.primaryFields, settings.primaryFieldsSeparator)
              const firstLetter = primaryInfo[0]
              const secondaryInfo = getItemString(item, settings.secondaryFields, settings.secondaryFieldsSeparator)
              return (
                <div key={item.id} className={itemClassName}>
                  <Link
                    tabIndex={-1}
                    to={`/${categoryId}/${item.id}`}
                    onClick={event => this.itemClick(event, item.id)}
                  >
                    <ListItem button={!isMarkedForRemove} disableRipple>
                      {showAvatar && item.image &&
                        <Avatar><Icon>{item.image}</Icon></Avatar>
                      }
                      {showAvatar && !item.image && firstLetter &&
                        <Avatar style={{background: getBackgroundAvatarLetter(firstLetter)}}>
                          {firstLetter}
                        </Avatar>
                      }
                      <ListItemText
                        classes={{
                          root: classes.itemText,
                          primary: classes.itemTextContent,
                          secondary: classes.itemTextContent
                        }}
                        primary={primaryInfo}
                        secondary={secondaryInfo}
                      />
                      {editMode &&
                        <ListItemSecondaryAction>
                          <IconButton aria-label="Item Menu">
                            {!relationMode &&
                              <MoreVert style={{display: !editMode ? 'none' : 'inherit'}}
                                onClick={event => this.handleMenuItemClick(event, item.id)}
                              />
                            }
                            {relationMode && isMarkedForRemove &&
                              <Reply
                                onClick={event => {
                                  event.preventDefault()
                                  event.stopPropagation()  
                                  unmarkRemoveItems([item.id])
                                }}
                              />
                            }
                            {relationMode && !isMarkedForRemove &&
                              <RemoveCircle
                                onClick={event => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  markRemoveItems([item.id])
                                }}
                              />
                            }
                          </IconButton>
                        </ListItemSecondaryAction>
                      }
                    </ListItem>
                  </Link>
                  <Divider/>
                </div>
              )
            })}
          </ReactCSSTransitionGroup>
        </List>

        <Menu
          anchorEl={anchorEl}
          open={showMenuItem}
          onClose={this.handleMenuItemClose}
          operations={[
            {id:'view', icon:ChromeReaderMode, label: 'View', onClick:() => {
              history.push(`/${categoryId}/${itemMenuClickedId}`)
              this.setState({showMenuItem: false, anchorEl: null})
            }},
            {id:'edit', icon:Edit, label: 'Edit', onClick:() => {
              history.replace(`/${categoryId}/${itemMenuClickedId}`, {editMode: true})
              this.setState({showMenuItem: false, anchorEl: null})
            }},
            {id:'delete', icon:Delete, label: 'Delete', onClick:() => {
              const item = items.find(item => item.id === itemMenuClickedId)
              const title = getItemString(item, settings.primaryFields, settings.primaryFieldsSeparator)
              onRemoveItem(itemMenuClickedId, title)
              this.setState({showMenuItem: false, anchorEl: null})
            }}
          ]}
        />

      </React.Fragment>
    )
  }
}

CategoryAgendaView.propTypes = {
  classes: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  showAvatar: PropTypes.bool,
  relationMode: PropTypes.bool,
  openDetailDialog: PropTypes.func
}

CategoryAgendaView.defaultProps = {
  showAvatar: true,
  relationMode: false
}

export default withStyles(styles)(CategoryAgendaView)