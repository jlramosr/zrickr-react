import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
  activeItem: {
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
  inactiveItem: {
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
    itemMenuClickedId: null,
    anchorEl: null,
    isSearching: false
  }

  onItemTapDown = itemId => {
    if (!this.itemPressedId) {
      const { mode, activeIds, addActiveId } = this.props
      const massiveSelection = Boolean(activeIds.length)
      this.itemPressedId = itemId
      if (mode !== 'relation' && !massiveSelection) {
        setTimeout(() => {
          if (this.itemPressedId) {
            addActiveId(this.itemPressedId)
            this.itemPressedId = null
          }
        }, 1000)
      }
    }
  }

  onItemClick = (itemId, primaryInfo) => {
    const { mode, onClickItem, activeIds, addActiveId } = this.props
    const massiveSelection = Boolean(activeIds.length)
    if (mode === 'relation') {
      onClickItem(itemId)
    } else if (!massiveSelection) {
      onClickItem(itemId, primaryInfo)
    } else {
      addActiveId(itemId)
    }
    this.itemPressedId = null
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      isSearching: this.props.searchQuery !== nextProps.searchQuery
    })
  }

  getItemValues = id =>
    this.props.items.find(item => item.id === id)

  onMenuItemClick = (event, itemId) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ anchorEl: event.currentTarget, itemMenuClickedId: itemId })
  }

  onMenuItemClose = () => {
    this.setState({ anchorEl: null })
  }

  onMenuItemExited = () => {
    this.setState({ itemMenuClickedId: null })
  }

  isReadonlyItem = id => {
    const { categoryStates } = this.props
    const itemValues = this.getItemValues(id)
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
      color,
      categoryStates,
      items,
      showAvatar,
      mode,
      editable,
      onRemoveItem,
      history,
      getNextStatesAsOperations,
      activeIds,
      toAddIds,
      toRemoveIds,
      markRemoveItems,
      unmarkRemoveItems,
      theme,
      classes
    } = this.props
    const {anchorEl, itemMenuClickedId, isSearching } = this.state

    const relationMode = mode === 'relation'
    const selectionMode = mode === 'election'
    const showDense = mode !== 'normal'

    return (
      <React.Fragment>
        <List
          onTouchMove={() => this.itemPressedId = null}
          onTouchEnd={() => this.itemPressedId = null}
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
                if (itemMenuClickedId === item.id) {
                  itemClassName = classes.menuActiveItem
                } else if (activeIds.length) {
                  if (activeIds.includes(item.id)) {
                    itemClassName = classes.activeItem
                  } else {
                    itemClassName = classes.inactiveItem
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
                  onMouseEnter: () => this.itemHoverId = item.id,
                  onMouseDown: () => this.onItemTapDown(item.id),
                  onTouchStart: () => this.onItemTapDown(item.id),
                  onClick: () => this.onItemClick(item.id, primaryInfo)
                }
              }
              
              return (
                <div key={item.id} className={itemClassName}>
                  <ListItem {...propsListItem}>
                    {showAvatarWithImage &&
                      <Avatar><Icon>{item.image}</Icon></Avatar>
                    }
                    {showAvatarWithLetter &&
                      <Avatar style={{background: colorAvatarWithLetter}}>
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
                    {editable && !activeIds.length &&
                      <ListItemSecondaryAction style={{paddingTop: showDense ? 3 : 0}}>
                        <IconButton aria-label="Item Menu">
                          {!relationMode &&
                            <MoreVert style={{display: !editable ? 'none' : 'inherit'}}
                              onClick={event => this.onMenuItemClick(event, item.id)}
                            />
                          }
                          {relationMode && isMarkedForRemove &&
                            <Tooltip title="Keep relation" placement="left" enterDelay={1000} leaveDelay={0}>
                              <Reply onClick={event => {
                                event.preventDefault()
                                event.stopPropagation()  
                                unmarkRemoveItems([item.id])
                              }}/>
                            </Tooltip>
                          }
                          {relationMode && !isMarkedForRemove &&
                            <Tooltip title="Remove relation" placement="left" enterDelay={1000} leaveDelay={0}>
                              <RemoveCircle onClick={event => {
                                event.preventDefault()
                                event.stopPropagation()
                                markRemoveItems([item.id])
                              }}/>
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
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.onMenuItemClose}
            onExited={this.onMenuItemExited}
            operations={[
              {id:'view', icon:Subtitles, label: 'View', onClick:() => {
                history.push(`/${categoriesPath}/${categoryId}/${itemMenuClickedId}`)
                this.setState({anchorEl: null})
              }},
              {id:'edit', hidden:this.isReadonlyItem(itemMenuClickedId), icon:Edit, label: 'Edit',
                onClick:() => {
                  history.replace(`/${categoriesPath}/${categoryId}/${itemMenuClickedId}`, {access: 'edit'})
                  this.setState({anchorEl: null})
                }
              },
              {id:'delete', icon:Delete, label: 'Delete', onClick:() => {
                const item = items.find(item => item.id === itemMenuClickedId)
                const title = getItemString(item, primaryFields, primaryFieldsSeparator)
                onRemoveItem(itemMenuClickedId, title)
                this.setState({anchorEl: null})
              }},
              {id:'divider'},
              ...getNextStatesAsOperations({
                itemId: itemMenuClickedId,
                itemValues: this.getItemValues(itemMenuClickedId),
                itemTitle: getItemString(
                  this.getItemValues(itemMenuClickedId),
                  primaryFields,
                  primaryFieldsSeparator
                )
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