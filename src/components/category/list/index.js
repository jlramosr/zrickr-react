import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { fetchItems, fetchItemsIfNeeded } from '../../../actions/items'
import HeaderLayout from '../../headerLayout'
import Category from '../'
import CategoryAgendaView from './agendaView'
import CategoryTableView from './tableView'
import { isEqual } from '../../../utils/helpers'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Close from 'material-ui-icons/Close'
import Add from 'material-ui-icons/Add'
import AddCircle from 'material-ui-icons/AddCircle'
import ViewList from 'material-ui-icons/ViewList'
import ViewAgenda from 'material-ui-icons/ViewAgenda'
import Delete from 'material-ui-icons/Delete'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import Directions from 'material-ui-icons/Directions'
import SelectAll from 'material-ui-icons/SelectAll'
import Menu from './../../menu'
import { showRelations, addOpenRelation, removeAllOpenRelations } from '../../../actions/interactions'
import { capitalize } from './../../../utils/helpers'
import { getItemString } from './../utils/helpers'
import escapeRegExp from 'escape-string-regexp'
import removeDiacritics from 'remove-diacritics'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  snackbar: {
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    overflow: 'hidden',
    minHeight: theme.standards.toolbarHeights.mobilePortrait,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      minHeight: theme.standards.toolbarHeights.mobileLandscape
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: theme.standards.toolbarHeights.tabletDesktop
    }
  },
  snackbarContent: {
    width: '100%',
    flex: 1,
    maxWidth: 'inherit',
    flexWrap: 'inherit'
  },
  snackbarContentMessage: {
    padding: 0
  },
  snackbarIconDisabled: {
    color: theme.palette.grey.main
  }
})

/**
 * A list with category items, showed in table or agenda shape.
 */
class CategoryList extends Component {
  state = {
    searchQuery: '',
    showingItems: [],
    activeIds: [],
    nextStatesOperations: [],
    showNewDialog: false,
    showListDialog: false,
    showDetailDialog: false,
    /**
     * oneOf(['agenda', 'table'])
     */
    view: 'agenda',
    anchorEl: null
  }

  componentWillMount = () => {
    const { mode, fetchItemsIfNeeded } = this.props
    if (fetchItemsIfNeeded) {
      mode === 'relation' ? fetchItemsIfNeeded() : this.props.fetchItems() //fetchItemsIfNeeded()
    }
    this.updateShowingItems({searchQuery: ''})
  }

  componentWillReceiveProps = nextProps => {
    const { editable, items, itemIds } = nextProps
    if (this.props.editable !== editable) {
      this.setState({tempAddItemIds:[], tempRemoveItemIds:[]})
    }
    if (!isEqual(this.props.items, items)) {
      this.updateShowingItems({items})
    }
    if (!isEqual(this.props.itemIds, itemIds)) {
      this.updateShowingItems({itemIds})
    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  /**
	 * Update the state with the new search string indicated by the user.
	 * @public
   * @param {string} searchQuery The string.
   * @returns {void}
	 */
  updateSearchQuery = searchQuery => {
    this.setState({ searchQuery })
    this.updateShowingItems({searchQuery})
  }

  updateShowingItems = ({searchQuery=this.state.searchQuery, items=this.props.items, itemIds=this.props.itemIds}) => {
    const { primaryFields } = this.props
    let foundItems = items
    let allFilterIds = null
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim())
      const match = new RegExp(escapeRegExp(cleanQuery), 'i')
      foundItems = items.filter(item => (
        match.test(removeDiacritics(getItemString(item, primaryFields)))
      ))
    }
    if (itemIds) {
      allFilterIds = (itemIds).reduce((ids, idState) => {
        if (idState.id) { //idState = {id:2134, state:true}
          return [...ids, idState.id] 
        } //idState = 2134
        return [...ids, idState] 
      }, [])
    }
    const showingItems = Object.values(foundItems).filter(item => (
      allFilterIds ? allFilterIds.includes(item.id) : true
    ))
    this.setState({ showingItems })
  }

  onChangeStateMenu = event => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleStatesMenuClose = () => {
    this.setState({anchorEl: null})
  }

  getCommonStates = itemIds => {
    if (!itemIds || (itemIds && !itemIds.length)) {
      return []
    }
    const { getNextStatesAsOperations, items } = this.props
    let states = null
    for (const itemId of itemIds) {
      const nextStatesItem = getNextStatesAsOperations({
        itemId,
        itemValues: items.find(item => item.id === itemId)
      })
      const nextStatesItemIds = nextStatesItem.map(state => state.id)
      if (!states) {
        states = [...nextStatesItem]
      }
      if (!states.length) {
        break
      }
      states = states.filter(state => nextStatesItemIds.includes(state.id))
    }
    return states || []
  }

  spliceActiveId = itemId => {
    this.setState(prevState => {
      let activeIds = prevState.activeIds
      let nextStatesOperations = prevState.nextStatesOperations
      const index = activeIds.findIndex(id => id === itemId)

      if (index < 0) {
        // add item id.
        activeIds = [...activeIds, itemId]
      } else {
        // remove item id.
        activeIds.splice(index, 1)
      }
      nextStatesOperations = this.getCommonStates(activeIds)
      
      return {activeIds, nextStatesOperations}
    })
  }

  addAllActiveIds = () => {
    const { showingItems } = this.state
    const showingItemsIds = showingItems.map(item => item.id)
    this.setState({activeIds: showingItemsIds, nextStatesOperations: this.getCommonStates(showingItemsIds)})
  }

  removeAllActiveIds = () => {
    this.setState({activeIds: [], nextStatesOperations: []})
  }

  onClickItem = (itemId, itemTitle='') => {
    const { mode, categoriesPath, categoryId, history, onSelect } = this.props
    if (mode === 'normal') {
      history.push(`/${categoriesPath}/${categoryId}/${itemId}`)
    } else if (mode === 'election') {
      onSelect([itemId])
    } else if (mode === 'relation') {
      this.openDetailDialog(itemId, itemTitle)
    }
  }

  /**
	 * Change the view of the list.
	 * @public
   * @param {string} view The desired view. One of 'table','agenda'.
   * @returns {void}
	 */
  changeView = view =>
    this.setState({view})

  /**
	 * Open the a new item dialog, updating the state.
	 * @public
	 * @returns {void}
	 */
  openNewDialog = () => {
    this.setState({ showNewDialog: true})
  }

  /**
	 * Open the a list items dialog, updating the state.
	 * @public
	 * @returns {void}
	 */
  openListDialog = () => {
    this.setState({ showListDialog: true})
  }

  /**
	 * Open the a detail item dialog, updating the state.
	 * @public
   * @param {string} itemId Unique id of the item pertaining to the dialog
	 * @returns {void}
	 */
  openDetailDialog = (itemId, itemTitle) => {
    const { categoryId, itemLabel, addOpenRelation, openRelations, showRelations } = this.props
    const relation = {
      categoryId,
      itemId,
      tempValues: null,
      access: 'info',
      title: itemTitle,
      itemLabel
    }
    addOpenRelation(relation)
    if (!openRelations.isShowing) {
      this.setState({ showDetailDialog: true })
      showRelations()
    }
  }

  /**
	 * Update the state indicating dialog is not showing. Closed process of 
   * 'detail' dialog will take over the own detail element. 
	 * @public
   * @returns {void}
	 */
  closeDialog = () => {
    if (this._isMounted) {
      this.setState({ showNewDialog: false, showListDialog: false, showDetailDialog: false })
    }
  }

  markAddRelations = markedItemIds => {
    const { mode, itemIds, onChange } = this.props
    if (mode === 'relation') {
      const tempToAddIds = markedItemIds.map(id => ( {id, state:'added'} ))
      onChange([...itemIds, ...tempToAddIds])
      this.closeDialog()
    }
  }

  markRemoveRelations = markedItemIds => {
    const { mode, itemIds, onChange } = this.props
    if (mode === 'relation') {
      const addedStateIds = itemIds.filter(idState => idState.state === 'added')
      const addedIds = addedStateIds.map(idState => idState.id)
      const tempItemIds = itemIds.reduce((idStates, idState) => {
        const isMarked = markedItemIds.includes(idState.id)
        if (addedIds.includes(idState.id) && isMarked) {
          return [...idStates]
        }
        if (isMarked) {
          return [...idStates, {id: idState.id, state:'removed'}]
        }
        return [...idStates, idState]
      }, [])
      onChange(tempItemIds)
    }
  }

  unmarkRemoveRelations = unmarkedItemIds => {
    const { mode, itemIds, onChange } = this.props
    if (mode === 'relation') {
      const tempItemIds = itemIds.reduce((idStates, idState) => {
        if (unmarkedItemIds.includes(idState.id)) {
          return [...idStates, {id: idState.id, state:true}]
        }
        return [...idStates, idState]
      }, [])
      onChange(tempItemIds)
    }
  }

  view(props) {
    const { view } = this.state
    if (view === 'table') {
      return <CategoryTableView {...props} />
    }
    if (view === 'agenda') {
      return <CategoryAgendaView {...props} />
    }
    return <CategoryAgendaView {...props} />
  }
  
  render = () => {
    const {
      mode,
      categoryId,
      categoryLabel,
      title,
      itemLabel,
      isFetchingSettings,
      isFetchingFields,
      itemIds,
      isFetchingItems,
      isUpdating,
      editable,
      openRelations,
      removeAllOpenRelations
    } = this.props
    const {
      searchQuery,
      showingItems,
      activeIds,
      nextStatesOperations,
      showNewDialog,
      showListDialog,
      showDetailDialog,
      view,
      anchorEl
    } = this.state

    const relationMode = mode === 'relation'

    const toAddIds = (itemIds || []).filter(
      idState => idState.state ? idState.state === 'added' : false
    ).map(idState => idState.id)
    const toRemoveIds = (itemIds || []).filter(
      idState => idState.state ? idState.state === 'removed' : false
    ).map(idState => idState.id)

    const { classes, ...rest } = this.props
    const commonProps = {
      ...rest,

      spliceActiveId: this.spliceActiveId,
      removeAllActiveIds: this.removeAllActiveIds,
      activeIds,

      toAddIds,
      toRemoveIds,
      markRemoveItems: this.markRemoveRelations,
      unmarkRemoveItems: this.unmarkRemoveRelations,

      items: showingItems,
      searchQuery,
      onClickItem: this.onClickItem
    }

    const { activeIndex } = openRelations
    const activeRelationItem = openRelations.list[activeIndex]

    return (
      <HeaderLayout
        relative={relationMode}
        relativeHeight={relationMode ? 200 : null}
        secondaryToolbar={relationMode}
        overflow={view === 'table' ? 'hidden' : 'auto'}
        title={`${capitalize(title || categoryLabel)}`}
        updateSearchQuery={view === 'agenda' ? this.updateSearchQuery : null}
        loading={isFetchingSettings || isFetchingFields || isFetchingItems || isUpdating}
        operations={[
          { 
            id: 'arrowBack',
            icon: ArrowBack,
            hidden: mode !== 'normal',
            to: '/'
          },
          { 
            id: 'close',
            icon: Close,
            hidden: mode !== 'election',
            onClick: this.props.closeDialog
          },
          {
            id: 'agenda',
            icon: ViewAgenda,
            description: 'Agenda View',
            hidden: view === 'agenda',
            right: true,
            small: true,
            onClick: () => this.changeView('agenda')
          },
          {
            id:'table',
            icon:ViewList,
            description: 'Table View',
            hidden: view === 'table',
            right: true,
            small: true,
            onClick: () => this.changeView('table')
          },
          {
            id:`new${capitalize(itemLabel)}`,
            icon: Add,
            hidden: relationMode,
            description: `New ${itemLabel}`,
            right: true,
            onClick: this.openNewDialog
          },
          {
            id:'addExistentItem',
            icon: AddCircle,
            hidden: !relationMode || !editable,
            description: `Add ${itemLabel} as relation`,
            right: true,
            onClick: this.openListDialog
          }
        ]}
      >

        {this.view(commonProps)}

        {relationMode && editable &&
          <Category
            scene="list"
            mode="election"
            categoryId={categoryId}
            itemIds={this.props.items.map(item => item.id).filter(itemId =>
              !showingItems.map(item => item.id).includes(itemId)
            )} //TODO allItemIds get from redux
            open={showListDialog}
            onSelect={this.markAddRelations}
            onClose={this.closeDialog}
          />
        }

        {relationMode && Boolean(openRelations.list.length) &&
          <Category
            scene="detail"
            mode="tabs"
            categoryId={activeRelationItem ? activeRelationItem.categoryId : null}
            itemId={activeRelationItem ? activeRelationItem.itemId : null}
            open={showDetailDialog}
            onClose={this.closeDialog}
            onExited={removeAllOpenRelations}
          />
        }

        {!relationMode &&
          <Category
            scene="new"
            mode={mode}
            categoryId={categoryId}
            open={showNewDialog}
            onClose={this.closeDialog}
          />
        }

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={Boolean(activeIds.length)}
          className={classes.snackbar}            
          transitionDuration={{
            enter: 200,
            exit: 0
          }}
          SnackbarContentProps={{
            classes: {
              root: classes.snackbarContent,
              message: classes.snackbarContentMessage
            }
          }}
          message={
            <React.Fragment>
              <IconButton key="close" aria-label="Close" color="inherit" onClick={this.removeAllActiveIds} >
                <Close />
              </IconButton>
              <span>
                {activeIds.length} selected
              </span>
            </React.Fragment>
          }
          action={[
            <IconButton
              disabled={activeIds.length === showingItems.length}
              key="selectAll"
              color="contrast"
              classes={{disabled: classes.snackbarIconDisabled}}
              aria-label="Select All"
              onClick={this.addAllActiveIds}
            >
              <SelectAll />
            </IconButton>,
            <IconButton
              disabled={!nextStatesOperations.length}
              key="changeState"
              color="contrast"
              classes={{disabled: classes.snackbarIconDisabled}}
              aria-label="Change State"
              onClick={this.onChangeStateMenu}
            >
              <Directions />
            </IconButton>,
            <IconButton
              key="delete"
              color="contrast"
              aria-label="Delete"
              onClick={this.removeAllActiveIds}
            >
              <Delete />
            </IconButton>
          ]}
        />

        {Boolean(activeIds.length) && 
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleStatesMenuClose}
            operations={nextStatesOperations}
          />
        }

      </HeaderLayout>
    )
  }
}

CategoryList.propTypes = {

  /**
   * List mode. 'Normal' mode indicates list belongs to the main category, so it's shown
   * in a normal view. When list is embedded in a item detail view, the mode is 'relation'.
   * The election mode shown a list in a dialog and one click on a item, produces an action.
   */
  mode: PropTypes.oneOf(['normal', 'relation', 'election']).isRequired,
  /**
   * Unique indentifier of category. Available on parent element from route.
   */
  categoryId: PropTypes.string.isRequired,
  /**
   * Ids of items to filter. If it's null, then it will be showed all category items.
   */
  itemIds: PropTypes.array,
  /**
   * If it's be able to change the state of list items, including removing operation.
   */
  editable: PropTypes.bool,
  /**
   * If it should be shown avatar in agenda view.
   */
  showAvatar: PropTypes.bool,

  /**
   * Category label to show on header.
   */
  categoryLabel: PropTypes.string.isRequired,
  /**
   * All category fields. It only be shown fields with property 'view.table'.
   */
  fields: PropTypes.arrayOf(PropTypes.shape({
    /**
     * Field unique identifier.
     */
    id: PropTypes.string.isRequired,
    /**
     * Field Label showed in the views.
     */
    label: PropTypes.string,
    /**
     * Description of field, showed under field in detail views (if 'nodescription' is true).
     */
    description: PropTypes.string,
    /**
     * One of: 'string','text','number','boolean','list','select','relation','date','currency'.
     * When type is 'list', there should be a 'relation' property.
     * When type is 'select', there should be either 'options' or 'relation' property.
     */
    type: PropTypes.oneOf(['string','text','number','boolean','list','select','relation','date','currency']),
    /**
     * Default value of the field.
     */
    default: PropTypes.any,
    /**
     * Necessary condition for field to be required.
     */
    required: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    /**
     * Necessary condition for field not to be editable.
     */
    readonly: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    /**
     * If it accepts more than one value (only it's good at fields with type 'select').
     */
    multi: PropTypes.bool,
    /**
     * Possible values when type is 'select'. Property 'relation' is also possible when
     * field is a one-to-many relation.
     */
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })),
    /**
     * Views where field appears, with its position and conditions.
     * Keys can be: 'table', 'detail'.
     */ 
    views: PropTypes.objectOf(PropTypes.shape({
      table: PropTypes.objectOf({
        x: PropTypes.number,
        y: PropTypes.number,
        xs: PropTypes.number,
        ys: PropTypes.number,
        when: PropTypes.string,
        nodescription: PropTypes.bool
      }),
      detail: PropTypes.objectOf({

      })
    }))
  })).isRequired,
  /**
   * All category items.
   */
  items: PropTypes.array,
  /**
   * It indicates if request to obtain settings is still active. It's used to show
   * the loading spinner until request finalizes.
   */
  isFetchingSettings: PropTypes.bool,
  /**
   * It indicates if request to obtain fields is still active. It's used to show
   * the loading spinner until request finalizes.
   */
  isFetchingFields: PropTypes.bool,
  /**
   * It indicates if request to obtain items is still active. It's used to show
   * the loading spinner until request finalizes.
   */
  isFetchingItems: PropTypes.bool

}

CategoryList.defaultProps = {

  editable: false,
  itemIds: null,

  showAvatar: false,
  isFetchingSettings: false,
  fields: [],
  isFetchingFields: false,
  items: [],
  isFetchingItems: false

}

const mapStateToProps = ({ categories, settings, fields, items, interactions, app }, props) => {
  const categoryId = props.categoryId
  const category = categories.byId[categoryId]
  const categoryLabel = categories.byId[categoryId].label
  const categorySettings = category.settings ? settings.byId[category.settings] : {}
  const itemLabel = categorySettings.itemLabel || 'Item'
  const { 
    states,
    primaryFields,
    primaryFieldsSeparator,
    secondaryFields,
    secondaryFieldsSeparator,
    color
  } = categorySettings
  const { openRelations } = interactions

  return {
    categoriesPath: app.categoriesPath,
    categoryLabel,
    categoryStates: states,
    itemLabel,
    primaryFields,
    secondaryFields,
    primaryFieldsSeparator,
    secondaryFieldsSeparator,
    color,
    isFetchingSettings: settings.flow[categoryId].isFetching,
    fields: Object.values(fields.byId).filter(field => category.fields.includes(field.id)),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    items: Object.values(items.byId).filter(item => category.items.includes(item.id)),
    isFetchingItems: items.flow[categoryId].isFetchingAll,
    isUpdating: items.flow[categoryId].isUpdating,
    openRelations
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchItems: () => dispatch(fetchItems(props.categoryId)),
  fetchItemsIfNeeded: () => dispatch(fetchItemsIfNeeded(props.categoryId)),
  showRelations: () => dispatch(showRelations()),
  addOpenRelation: relation => dispatch(addOpenRelation(relation)),
  removeAllOpenRelations: () => dispatch(removeAllOpenRelations())
})

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(CategoryList)
  )
)