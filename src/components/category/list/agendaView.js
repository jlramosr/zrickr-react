import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Tooltip from 'material-ui/Tooltip'
import RemoveCircle from 'material-ui-icons/RemoveCircle'
import Reply from 'material-ui-icons/Reply'
import MoreVert from 'material-ui-icons/MoreVert'
import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui-icons/Edit'
import Subtitles from 'material-ui-icons/Subtitles'
import Delete from 'material-ui-icons/Delete'
import Done from 'material-ui-icons/Done'
import { isTouchDevice } from './../../../utils/helpers'
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
      paddingLeft: theme.spacing.unit*8,
      paddingRight: theme.spacing.unit*8
    },
    [`${theme.breakpoints.up('lg')}`]: {
      paddingLeft: theme.spacing.unit*16,
      paddingRight: theme.spacing.unit*16
    }
  },
  selectionDense: {
    padding: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  relationDense: {
    padding: theme.spacing.unit/2
  },
  itemText: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    pointerEvents: 'none'
  },
  itemTextContent: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none'
  },
  defaultItem: {
    background: theme.palette.white,
    transition: theme.transitions.create('background', {
      easing: theme.transitions.easing.easeOut,
      duration: 600
    }),
    '& :hover': {
      background: theme.palette.grey.light
    },
    '& :active': {
      background: theme.palette.grey.light
    }
  },
  selectedItem: {
    background: theme.palette.secondary.extraLight,
    transition: theme.transitions.create('background', {
      easing: theme.transitions.easing.easeOut,
      duration: 600
    }),
    '& :hover': {
      background: theme.palette.secondary.extraLight
    },
    '& :active': {
      background: theme.palette.secondary.extraLight
    }
  },
  deselectedItem: {
    background: theme.palette.white,
    '& :hover': {
      background: theme.palette.white,
      [`${theme.breakpoints.up('md')}`]: {
        background: theme.palette.grey.light
      }
    },
    '& :active': {
      background: theme.palette.grey.light
    }
  },
  menuActiveItem: {
    background: theme.palette.grey.light,
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

class CategoryAgendaView extends Component {
  state = {
    itemMenuId: null,
    anchorEl: null,
    isSearching: false
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      isSearching: this.props.searchQuery !== nextProps.searchQuery
    })
  }

  onItemClick = (itemId, primaryInfo) => {
    const { mode, onItemClick, selectedIds, changeSelectedIds } = this.props
    const massiveSelection = Boolean(selectedIds.length)
    if (mode === 'relation') {
      onItemClick(itemId, primaryInfo)
    } else if (!massiveSelection) {
      onItemClick(itemId, primaryInfo)
    } else if (!this.firstActiveId) {
      changeSelectedIds(itemId)
    }
  }

  onItemMouseDown = (event, itemId) => {
    this.firstActiveId = false
    if (event.button === 0) { //mouse left button
      const { mode, selectedIds, changeSelectedIds } = this.props
      const massiveSelection = Boolean(selectedIds.length)
      this.itemPressedId = itemId
      if (mode !== 'relation' && !massiveSelection) {
        setTimeout(() => {
          if (this.itemPressedId) {
            changeSelectedIds(this.itemPressedId)
            this.itemPressedId = null
            this.firstActiveId = true
          }
        }, 300)
      }
    }
  }

  onItemMouseUp = () => {
    this.itemPressedId = null
  }

  //https://developer.mozilla.org/es/docs/Web/Events/contextmenu
  onItemContextMenu = (event, itemId) => {
    event.preventDefault()
    const { selectedIds, changeSelectedIds } = this.props
    if (!selectedIds.length) {
      const button = event.button
      if (button === 0) { //touch action
        changeSelectedIds(itemId) 
      } else if (button === 2) { //right button mouse action
        this.anchorTop = event.clientY
        this.anchorLeft = event.clientX
        this.setState({ anchorEl: ReactDOM.findDOMNode(document.getElementById('root')), itemMenuId: itemId })
      }
    }
  }

  onAvatarClick = (event, itemId) => {
    event.stopPropagation()
    this.props.changeSelectedIds(itemId)
  }

  onMenuItemClick = (event, itemId) => {
    event.stopPropagation()
    this.anchorLeft = 0
    this.anchorTop = 0
    this.setState({ anchorEl: event.currentTarget, itemMenuId: itemId })
  }

  onMenuItemClose = () => {
    this.setState({ anchorEl: null })
  }

  onMenuItemExited = () => {
    this.setState({ itemMenuId: null })
  }

  isReadonlyItem = id => {
    const { categoryStates, getItem } = this.props
    const itemValues = getItem(id)
    if (!itemValues) {
      return false
    }
    return categoryStates.readonly.includes(itemValues.state)
  }

  render = () => {
    const {
      categoriesPath,
      categoryId,
      primaryFields,
      primaryFieldsSeparator,
      secondaryFields,
      secondaryFieldsSeparator,
      getItem,
      color,
      categoryStates,
      items,
      showAvatar,
      mode,
      editable,
      onRemoveItems,
      history,
      getNextStatesAsOperations,
      selectedIds,
      toAddIds,
      toRemoveIds,
      markRemoveItems,
      unmarkRemoveItems,
      theme,
      classes
    } = this.props
    const {anchorEl, itemMenuId, isSearching } = this.state

    const relationMode = mode === 'relation'
    const selectionMode = mode === 'election'
    const showDense = mode !== 'normal'

    const itemMenu = getItem(itemMenuId)
    const itemMenuState = itemMenu && itemMenu.state ? itemMenu.state : null
    const itemMenuTitle = getItemString(itemMenu, primaryFields, primaryFieldsSeparator)

    return (
      <React.Fragment>
        <List
          classes={{
            padding: classes.padding,
            dense: selectionMode ? classes.selectionDense : classes.relationDense
          }}
          dense={showDense}
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
            transitionEnter={relationMode && !isSearching}
            transitionEnterTimeout={300}
            transitionLeave={!isSearching}
            transitionLeaveTimeout={300}
            transitionAppear={relationMode}
            transitionAppearTimeout={200}
          >
            {items.map(item => {
              let isMarkedForRemove = false
              let itemClassName = classes.defaultItem
              if (mode !== 'relation') {
                if (itemMenuId === item.id) {
                  itemClassName = classes.menuActiveItem
                } else if (selectedIds.length) {
                  if (selectedIds.includes(item.id)) {
                    itemClassName = classes.selectedItem
                  } else {
                    itemClassName = classes.deselectedItem
                  }
                }
              } else {
                if (toRemoveIds && toRemoveIds.includes(item.id)) {
                  isMarkedForRemove = true
                  itemClassName = classes.markRemovedItem
                } else if (toAddIds && toAddIds.includes(item.id)) {
                  itemClassName = classes.markAddedItem
                }
              }

              const primaryInfo = getItemString(item, primaryFields, primaryFieldsSeparator) || ' '
              const firstLetter = primaryInfo[0]
              const secondaryInfo = getItemString(item, secondaryFields, secondaryFieldsSeparator)
              const showAvatarWithImage = showAvatar && item.image
              const showAvatarWithLetter = showAvatar && !item.image && (firstLetter && firstLetter !== '')
              const statesList = categoryStates ? categoryStates.list : null
              let colorAvatarWithLetter = theme.palette.primary.dark
              if (showAvatarWithLetter) {
                if (statesList) {
                  if  (item.state && statesList[item.state].color) {
                    colorAvatarWithLetter = statesList[item.state].color
                  } else if (color) {
                    colorAvatarWithLetter = color
                  }
                } else {
                  colorAvatarWithLetter = getBackgroundAvatarLetter(firstLetter)
                }    
              }

              let propsListItem = {
                dense: showDense,
                tabIndex: -1
              }
              if (!isMarkedForRemove) {
                propsListItem = {
                  ...propsListItem,
                  disableRipple: true,
                  button: true,
                  onClick: () => this.onItemClick(item.id, primaryInfo),
                  onMouseDown: event => this.onItemMouseDown(event, item.id),
                  onMouseUp: this.onItemMouseUp,
                  onContextMenu: event => this.onItemContextMenu(event, item.id)
                }
              }
              
              return (
                <div key={item.id}>
                  <ListItem className={itemClassName} {...propsListItem}>
                    {showAvatarWithImage &&
                      <Avatar onClick={event => this.onAvatarClick(event, item.id)}>
                        {selectedIds.includes(item.id) ? <Done style={{background: 'transparent'}} /> : <Icon>{item.image}</Icon>}
                      </Avatar>
                    }
                    {showAvatarWithLetter &&
                      <Avatar onClick={event => this.onAvatarClick(event, item.id)} style={{background: colorAvatarWithLetter}}>
                        {selectedIds.includes(item.id) ? <Done style={{background: 'transparent'}} /> : firstLetter}
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
                    {editable && !selectedIds.length &&
                      <ListItemSecondaryAction style={{paddingTop: showDense ? 2 : 0}}>
                        <IconButton aria-label="Item Menu">
                          {isTouchDevice() && !relationMode && editable &&
                            <MoreVert onClick={event => this.onMenuItemClick(event, item.id)} />
                          }
                          {relationMode && isMarkedForRemove &&
                            <Tooltip title="Keep relation" placement="left" enterDelay={1000} leaveDelay={0}>
                              <Reply
                                onClick={event => {
                                  event.preventDefault()
                                  event.stopPropagation()  
                                  unmarkRemoveItems([item.id])
                                }}
                              />
                            </Tooltip>
                          }
                          {relationMode && !isMarkedForRemove &&
                            <Tooltip title="Remove relation" placement="left" enterDelay={1000} leaveDelay={0}>
                              <RemoveCircle
                                onClick={event => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  markRemoveItems([item.id])
                                }}
                              />
                            </Tooltip>
                          }
                        </IconButton>
                      </ListItemSecondaryAction>
                    }
                  </ListItem>
                  <Divider/>
                </div>
              )
            })}
          </ReactCSSTransitionGroup>
        </List>

        {editable && !relationMode &&
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            offsetTop={this.anchorTop || null}
            offsetLeft={this.anchorLeft || null}
            onClose={this.onMenuItemClose}
            onExited={this.onMenuItemExited}
            operations={[
              {id:'view', icon:Subtitles, label: 'View', onClick:() => {
                history.push(`/${categoriesPath}/${categoryId}/${itemMenuId}`)
                this.setState({anchorEl: null})
              }},
              {id:'edit', hidden:this.isReadonlyItem(itemMenuId), icon:Edit, label: 'Edit',
                onClick:() => {
                  history.replace(`/${categoriesPath}/${categoryId}/${itemMenuId}`, {access: 'edit'})
                  this.setState({anchorEl: null})
                }
              },
              {id:'delete', icon:Delete, label: 'Delete', onClick:() => {
                const item = getItem(itemMenuId)
                const title = getItemString(item, primaryFields, primaryFieldsSeparator)
                onRemoveItems({
                  itemIds: itemMenuId,
                  title
                })
                this.setState({anchorEl: null})
              }},
              {id:'divider'},
              ...getNextStatesAsOperations({
                stateId: itemMenuState,
                itemIdsToUpdate: itemMenuId,
                title: itemMenuTitle
              })
            ]}
          />
        }

      </React.Fragment>
    )
  }
}

CategoryAgendaView.propTypes = {
  mode: PropTypes.oneOf(['normal', 'relation', 'election']).isRequired,
  categoryId: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  showAvatar: PropTypes.bool,
  classes: PropTypes.object.isRequired
}

CategoryAgendaView.defaultProps = {
  showAvatar: true
}

export default withStyles(styles, {withTheme: true})(CategoryAgendaView)