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

const styles = theme => ({
  markAddedItem: {
    background: theme.palette.success[50]
  },
  markRemovedItem: {
    background: theme.palette.error[50],
    opacity: 0.5
  },
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
  }
})

let CategoryAgendaView = class extends Component {
  state = {
    addMarkedItems: [],
    removeMarkedItems: [],
    showMenuItem: false,
    itemMenuClicked: null,
    anchorEl: null
  }

  itemClick(event, itemId) {
    const { relationMode, dialogMode, openDetailDialog } = this.props
    if (relationMode) {
      event.preventDefault()
      openDetailDialog(itemId)
    } else if (dialogMode) {
      event.preventDefault()
      this.addItems([itemId])
    }
  }

  handleMenuItemClick = (event, itemId) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ showMenuItem: true, anchorEl: event.currentTarget, itemMenuClicked: itemId })
  }

  addItems = itemIds => {
    const addMarkedItems = [...this.state.addMarkedItems, ...itemIds]
    this.setState({addMarkedItems})   
    this.props.addItems(addMarkedItems)
  }

  removeItems = (event, itemIds) => {
    event.preventDefault()
    event.stopPropagation()
    const removeMarkedItems = [...this.state.removeMarkedItems, ...itemIds]
    this.setState({removeMarkedItems})   
    this.props.removeItems(removeMarkedItems)
  }

  undoRemoveItems = (event, itemIds) => {
    event.preventDefault()
    event.stopPropagation()
    const removeMarkedItems = this.state.removeMarkedItems.filter(item => !itemIds.includes(item))
    this.setState({removeMarkedItems})
    this.props.removeItems(removeMarkedItems)
  }

  handleMenuItemClose = () => {
    this.setState({ showMenuItem: false, itemMenuClicked: null })
  }

  render = () => {
    const {
      classes,
      categoryId,
      settings,
      items,
      showAvatar,
      dialogMode,
      relationMode,
      editMode
    } = this.props
    const { addMarkedItems, removeMarkedItems } = this.state
    console.log(addMarkedItems, removeMarkedItems, items)

    return (
      <React.Fragment>
        <List
          classes={{
            padding: classes.padding,
            dense: classes.dense
          }}
          dense={relationMode || dialogMode}
        >
          {items.map(item => {
            const isMarkedForRemove = removeMarkedItems.includes(item.id)
            const isMarkedForAdd = addMarkedItems.includes(item.id)
            const isMarked = isMarkedForRemove || isMarkedForAdd
            return (
              <React.Fragment key={item.id}>
                <Link
                  tabIndex={-1}
                  to={`/${categoryId}/${item.id}`}
                  onClick={event => this.itemClick(event, item.id)}
                >
                  <ListItem
                    button={!isMarkedForRemove}
                    disableRipple
                    className={
                      isMarkedForRemove ? classes.markRemovedItem : (
                        isMarkedForAdd ? classes.markAddedItem : ''
                      )
                    }
                  >
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
                          {relationMode && isMarkedForAdd &&
                            <Undo
                              onClick={event => this.undoRemoveItems(event, [item.id])}
                            />
                          }
                          {relationMode && isMarkedForRemove &&
                            <Undo
                              onClick={event => this.undoRemoveItems(event, [item.id])}
                            />
                          }
                          {relationMode && !isMarked &&
                            <RemoveCircleOutline
                              onClick={event => this.removeItems(event, [item.id])}
                            />
                          }
                        </IconButton>
                      </ListItemSecondaryAction>
                    }
                  </ListItem>
                </Link>
                <Divider/>
              </React.Fragment>
            )
          })}
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