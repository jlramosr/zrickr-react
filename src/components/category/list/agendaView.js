import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import RemoveCircleOutline from 'material-ui-icons/RemoveCircleOutline'
import Undo from 'material-ui-icons/Undo'
import MoreVert from 'material-ui-icons/MoreVert'
import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import { getItemString } from './../utils/helpers'
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
      paddingLeft: theme.spacing.unit*3,
      paddingRight: theme.spacing.unit*3
    },
    [`${theme.breakpoints.up('lg')}`]: {
      paddingLeft: theme.spacing.unit*4,
      paddingRight: theme.spacing.unit*4
    }
  },
  dense: {
    padding: 0
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
    transition: 'background 300ms ease-out'
  },
  markAddedItem: {
    background: theme.palette.success[50],
    opacity: 0.95
  },
  markRemovedItem: {
    background: theme.palette.error[50],
    opacity: 0.8,
    transition: 'opacity 300ms ease-out, background 300ms ease-out'
  },
  animationEnter: {
    opacity: 0.01,
    background: theme.palette.white,
    transform: 'translate(-10em, 0)'
  },
  animationEnterActive: {
    opacity: 1,
    background: theme.palette.success[50],
    transition: 'opacity 300ms ease-out, transform 300ms ease-out, background 300ms ease-out',
    transform: 'translate(0,0)' 
  },
  animationLeave: {
    background: theme.palette.error[50],
    transform: 'translate(0,0)'
  },
  animationLeaveActive: {
    transition: 'transform 300ms ease-out',
    transform: 'translate(-100em, 0)'
  },
  animationAppear: {
    transform: 'translate(0, 10em)'
  },
  animationAppearActive: {
    transition: 'transform 300ms ease-out',
    transform: 'translate(0,0)'
  }
})

let CategoryAgendaView = class extends Component {
  state = {
    showMenuItem: false,
    itemMenuClicked: null,
    anchorEl: null
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
    this.setState({ showMenuItem: true, anchorEl: event.currentTarget, itemMenuClicked: itemId })
  }

  handleMenuItemClose = () => {
    this.setState({ showMenuItem: false, itemMenuClicked: null })
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
      tempAddItemIds,
      markRemoveItems,
      unmarkRemoveItems,
      tempRemoveItemIds,
      classes
    } = this.props

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
              leave: classes.animationLeave,
              leaveActive: classes.animationLeaveActive,
              appear: classes.animationAppear,
              appearActive: classes.animationAppearActive
            }}
            transitionAppear={relationMode}
            transitionAppearTimeout={relationMode ? 300 : false}
            transitionEnterTimeout={relationMode ? 300 : false}
            transitionLeaveTimeout={relationMode ? 300 : false}
          >
            {items.map(item => {
              const isMarkedForAdd = tempAddItemIds ? tempAddItemIds.includes(item.id) : false
              const isMarkedForRemove = tempRemoveItemIds ? tempRemoveItemIds.includes(item.id) : false
              let itemClassName = classes[
                isMarkedForRemove ? 'markRemovedItem' : (isMarkedForAdd ? 'markAddedItem' : 'unmarkedItem')
              ]
              return (
                <div key={item.id} className={itemClassName}>
                  <Link
                    tabIndex={-1}
                    to={`/${categoryId}/${item.id}`}
                    onClick={event => this.itemClick(event, item.id)}
                  >
                    <ListItem button={!isMarkedForRemove} disableRipple>
                      {showAvatar &&
                        <Avatar>
                          <Icon>{settings.icon}</Icon>
                        </Avatar>
                      }
                      <ListItemText
                        classes={{
                          root: classes.itemText,
                          text: classes.itemTextContent
                        }}
                        primary={getItemString(settings.primaryFields, item)}
                        secondary={getItemString(settings.secondaryFields, item)}
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
                              <Undo
                                onClick={event => {
                                  event.preventDefault()
                                  event.stopPropagation()  
                                  unmarkRemoveItems([item.id])
                                }}
                              />
                            }
                            {relationMode && !isMarkedForRemove &&
                              <RemoveCircleOutline
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
          elevation={4}
          transformOrigin={{ vertical: 'top', horizontal: 'left'}}
          anchorEl={this.state.anchorEl}
          open={this.state.showMenuItem}
          onClose={this.handleMenuItemClose}
          className={classes.menu}
        >
          <MenuItem onClick={this.handleMenuItemClose}>
            View
          </MenuItem>
          <MenuItem onClick={this.handleMenuItemClose}>
            Edit
          </MenuItem>
          <MenuItem onClick={this.handleMenuItemClose}>
            Delete
          </MenuItem>
        </Menu>
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