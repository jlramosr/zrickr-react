import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchItems, fetchItemsIfNeeded } from '../../../actions/items'
import HeaderLayout from '../../headerLayout'
import CategoryAgendaView from './agendaView'
import CategoryTableView from './tableView'
import { isEqual } from '../../../utils/helpers'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Close from 'material-ui-icons/Close'
import Add from 'material-ui-icons/Add'
import AddCircle from 'material-ui-icons/AddCircle'
import ViewList from 'material-ui-icons/ViewList'
import ViewAgenda from 'material-ui-icons/ViewAgenda'
import ItemNew from './../new'
import Dialog from '../../dialog/large'
import { showRelations, addOpenRelation } from '../../../actions/interactions'
import { capitalize } from './../../../utils/helpers'
import { getItemString } from './../utils/helpers'
import escapeRegExp from 'escape-string-regexp'
import removeDiacritics from 'remove-diacritics'

/**
 * A list with category items, showed in table or agenda shape.
 */
class CategoryList extends Component {
  state = {
    searchQuery: '',
    foundItems: [],
    showNewDialog: false,
    showListDialog: false,
    tableMode: false
  }

  componentWillMount = () => {
    const { items, relationMode, fetchItemsIfNeeded } = this.props
    if (fetchItemsIfNeeded) {
      relationMode ? fetchItemsIfNeeded() : fetchItemsIfNeeded() //this.props.fetchItems()
    }
    this.setState({ foundItems: items })
  }

  componentWillReceiveProps = nextProps => {
    const { editMode, items } = nextProps
    if (this.props.editMode !== editMode) {
      this.setState({tempAddItemIds:[], tempRemoveItemIds:[]})
    }
    if (!isEqual(this.props.items, items)) {
      this.updateFoundItems({items})
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
    this.updateFoundItems({searchQuery})
  }

  updateFoundItems = ({searchQuery=this.state.searchQuery, items=this.props.items}) => {
    let foundItems = items
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim())
      const match = new RegExp(escapeRegExp(cleanQuery), 'i')
      foundItems = items.filter(item => (
        match.test(removeDiacritics(getItemString(item, this.props.settings.primaryFields)))
      ))
    }
    this.setState({ foundItems })
  }

  /**
	 * Change the view of the list.
	 * @public
   * @param {string} view The desired view. One of 'table','agenda'.
   * @returns {void}
	 */
  changeView = view =>
    this.setState({tableMode: view === 'table'})

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
  openDetailDialog = itemId => {
    const { relationMode, categoryId, addOpenRelation, showRelations, isShowingRelations } = this.props
    if (relationMode) {
      addOpenRelation(categoryId, itemId)
      if (!isShowingRelations) {
        showRelations()
      }
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
      this.setState({ showNewDialog: false, showListDialog: false })
    }
  }

  markAddRelations = markedItemIds => {
    const { relationMode, filterItemIds, sendFormFieldChange } = this.props
    if (relationMode) {
      const tempToAddIds = markedItemIds.map(id => ( {id, state:'added'} ))
      sendFormFieldChange([...filterItemIds, ...tempToAddIds])
      this.closeDialog()
    }
  }

  markRemoveRelations = markedItemIds => {
    const { relationMode, filterItemIds, sendFormFieldChange } = this.props
    if (relationMode) {
      const addedStateIds = filterItemIds.filter(idState => idState.state === 'added')
      const addedIds = addedStateIds.map(idState => idState.id)
      const tempItemIds = filterItemIds.reduce((idStates, idState) => {
        const isMarked = markedItemIds.includes(idState.id)
        if (addedIds.includes(idState.id) && isMarked) {
          return [...idStates]
        }
        if (isMarked) {
          return [...idStates, {id: idState.id, state:'removed'}]
        }
        return [...idStates, idState]
      }, [])
      sendFormFieldChange(tempItemIds)
    }
  }

  unmarkRemoveRelations = unmarkedItemIds => {
    const { relationMode, filterItemIds, sendFormFieldChange } = this.props
    if (relationMode) {
      const tempItemIds = filterItemIds.reduce((idStates, idState) => {
        if (unmarkedItemIds.includes(idState.id)) {
          return [...idStates, {id: idState.id, state:true}]
        }
        return [...idStates, idState]
      }, [])
      sendFormFieldChange(tempItemIds)
    }
  }
  
  render = () => {
    const {
      categoryId,
      categoryLabel,
      categoryItemLabel,
      onCreateItem,
      getNextStatesAsOperations,
      isFetchingSettings,
      isFetchingFields,
      filterItemIds,
      isFetchingItems,
      isUpdating,
      operations,
      relationMode,
      editMode,
      dialogMode,
      history
    } = this.props
    const {
      foundItems,
      searchQuery,
      showNewDialog,
      showListDialog,
      tableMode
    } = this.state

    let allFilterIds = null
    if (filterItemIds) {
      allFilterIds = (filterItemIds).reduce((ids, idState) => {
        if (idState.id) { //idState = {id:2134, state:true}
          return [...ids, idState.id] 
        } //idState = 2134
        return [...ids, idState] 
      }, [])
    }

    const toAddIds = (filterItemIds || []).filter(
      idState => idState.state ? idState.state === 'added' : false
    ).map(idState => idState.id)
    const toRemoveIds = (filterItemIds || []).filter(
      idState => idState.state ? idState.state === 'removed' : false
    ).map(idState => idState.id)

    const showingItems = Object.values(foundItems).filter(item => (
      allFilterIds ? allFilterIds.includes(item.id) : true
    ))

    const commonProps = {
      ...this.props,
      items: showingItems,
      searchQuery,
      openDetailDialog: this.openDetailDialog,
      toAddIds,
      toRemoveIds,
      markRemoveItems: this.markRemoveRelations,
      unmarkRemoveItems: this.unmarkRemoveRelations
    }

    return (
      <HeaderLayout
        relative={relationMode}
        relativeHeight={relationMode ? 200 : null}
        secondaryToolbar={relationMode}
        overflow={tableMode ? 'hidden' : 'auto'}
        title={categoryLabel}
        updateSearchQuery={!tableMode ? this.updateSearchQuery : null}
        loading={isFetchingSettings || isFetchingFields || isFetchingItems || isUpdating}
        operations={operations || [
          { 
            id: 'arrowBack',
            icon: ArrowBack,
            hidden: relationMode || dialogMode,
            to: '/'
          },
          { 
            id: 'close',
            icon: Close,
            hidden: !dialogMode,
            onClick: this.props.closeDialog
          },
          {
            id: 'agenda',
            icon: ViewAgenda,
            description: 'Agenda View',
            hidden: !tableMode,
            right: true,
            small: true,
            onClick: () => this.changeView('agenda')
          },
          {
            id:'table',
            icon:ViewList,
            description: 'Table View',
            hidden: tableMode,
            right: true,
            small: true,
            onClick: () => this.changeView('table')
          },
          {
            id:`new${capitalize(categoryItemLabel || 'Item')}`,
            icon: Add,
            hidden: relationMode,
            description: `New ${categoryItemLabel || 'Item'}`,
            right: true,
            onClick: this.openNewDialog
          },
          {
            id:'addExistentItem',
            icon: AddCircle,
            hidden: !relationMode || !editMode,
            description: `New ${categoryItemLabel || 'Item'}`,
            right: true,
            onClick: this.openListDialog
          }
        ]}
      >

        {tableMode ? 
          <CategoryTableView {...commonProps} /> : 
          <CategoryAgendaView {...commonProps} />
        }

        <Dialog
          fullScreen={!dialogMode}
          open={showNewDialog}
          onClose={this.closeDialog}
        >
          <ItemNew
            onCreateItem={onCreateItem}
            getNextStatesAsOperations={getNextStatesAsOperations}
            closeDialog={this.closeDialog}
            history={history}
            categoryId={categoryId}
            categoryItemLabel={categoryItemLabel}
          />
        </Dialog>

        {relationMode &&
          <Dialog
            open={showListDialog}
            onClose={this.closeDialog}
          >
            <CategoryList
              {...this.props}
              filterItemIds={this.props.items.map(item => item.id).filter(itemId =>
                !showingItems.map(item => item.id).includes(itemId)
              )}
              //TODO allItemIds get from redux
              editMode={false}
              tableMode={false}
              relationMode={false}
              showAvatar={false}
              dialogMode
              markAddItems={this.markAddRelations}
              closeDialog={this.closeDialog}
            />
          </Dialog>
        }

      </HeaderLayout>
    )
  }
}

CategoryList.propTypes = {
  /**
   * Unique indentifier of category. Available on parent element from route.
   */
  categoryId: PropTypes.string.isRequired,
  /**
   * Category label to show on header.
   */
  categoryLabel: PropTypes.string.isRequired,
  /**
   * Category settings like color, main fields to get the title of an item, etc.
   */
  settings: PropTypes.object,
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
   * Ids of items to filter. If it's null, then it will be showed all category items.
   */
  filterItemIds: PropTypes.array,
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
  isFetchingItems: PropTypes.bool,
  /**
   * Operations showed on the header. In other case, operations will be 'arrowBack' (left) and
   * 'viewAgenda', 'viewTable' and 'addNewItem' or 'addExistentItem' (right).
   */
  operations: PropTypes.array,
  /**
   * It indicates if list is showed on a view inside to the other view (tipically a relation
   * 'many-to-one' or 'many-to-many' of a category item).
   */
  relationMode: PropTypes.bool,
  /**
   * If items are shown firstly on a table. In other case, it will shown with agenda view.
   */
  tableMode: PropTypes.bool,
  /**
   * If it's be able to change the state of list items.
   */
  editMode: PropTypes.bool,
  /**
   * If the list is shown such as an item can be selected in a dialog
   * (for instance, when it adds an item to a relation).
   */
  dialogMode: PropTypes.bool,
  /**
   * If it should be shown avatar in agenda view.
   */
  showAvatar: PropTypes.bool
}

CategoryList.defaultProps = {
  settings: {},
  isFetchingSettings: false,
  fields: [],
  isFetchingFields: false,
  filterItemIds: null,
  items: [],
  isFetchingItems: false,
  relationMode: false,
  tableMode: true,
  editMode: true,
  dialogMode: false,
  showAvatar: true
}

const mapStateToProps = ({ categories, settings, fields, items, interactions }, props) => {
  const categoryId = props.categoryId
  const category = categories.byId[categoryId]
  const categorySettings = category.settings ? settings.byId[category.settings] : {}
  return {
    categoryItemLabel: categorySettings.itemLabel,
    categoryStates: categorySettings.states,
    settings: categorySettings,
    isFetchingSettings: settings.flow[categoryId].isFetching,
    fields: Object.values(fields.byId).filter(field => category.fields.includes(field.id)),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    items: Object.values(items.byId).filter(item => category.items.includes(item.id)),
    isFetchingItems: items.flow[categoryId].isFetchingAll,
    isUpdating: items.flow[categoryId].isUpdating,
    isShowingRelations: interactions.relations.isShowing
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchItems: () => dispatch(fetchItems(props.categoryId)),
  fetchItemsIfNeeded: () => dispatch(fetchItemsIfNeeded(props.categoryId)),
  showRelations: () => dispatch(showRelations()),
  addOpenRelation: (categoryId, itemId) => dispatch(addOpenRelation(categoryId, itemId))
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)