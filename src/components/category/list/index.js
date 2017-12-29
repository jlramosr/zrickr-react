import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchItems, fetchItemsIfNeeded } from '../../../actions/items'
import HeaderLayout from '../../headerLayout'
import CategoryAgendaView from './agendaView'
import CategoryTableView from './tableView'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Close from 'material-ui-icons/Close'
import Add from 'material-ui-icons/Add'
import AddCircleOutline from 'material-ui-icons/AddCircleOutline'
import ViewList from 'material-ui-icons/ViewList'
import ViewAgenda from 'material-ui-icons/ViewAgenda'
import ItemNew from './../new'
import Dialog from '../../dialog'
import { showRelations, addOpenRelation } from '../../../actions/interactions'
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
    tempAddItemIds: [],
    tempRemoveItemIds: [],
    showNewDialog: false,
    showListDialog: false,
    tableMode: false
  }

  updateSearchQuery = searchQuery => {
    const { settings, items } = this.props
    let foundItems = items
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim())
      const match = new RegExp(escapeRegExp(cleanQuery), 'i')
      foundItems = items.filter(item => (
        match.test(removeDiacritics(getItemString(settings.primaryFields, item)))
      ))
    }
    this.setState({ foundItems, searchQuery })
  }

  /**
	 * Update the state with the new search string indicated by the user.
	 * @public
   * @param {string} searchQuery The string.
   * @returns {void}
	 */
  //updateSearchQuery = searchQuery => this.setState({searchQuery})

  /**
	 * Change the view of the list.
	 * @public
   * @param {string} view The desired view. One of 'table','agenda'.
   * @returns {void}
	 */
  changeView = view => this.setState({tableMode: view === 'table'})

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
    this.setState({ showNewDialog: false, showListDialog: false })
  }

  markAddRelations = markedItemIds => {
    const { relationMode, itemIds, sendFormFieldChange } = this.props
    if (relationMode) {
      const tempAddItemIds = [...this.state.tempAddItemIds, ...markedItemIds]
      const tempItemIds = [...itemIds, ...tempAddItemIds].filter(itemId =>
        !this.state.tempRemoveItemIds.includes(itemId)
      )
      this.setState({tempAddItemIds})
      sendFormFieldChange(tempItemIds)
      this.closeDialog()
    }
  }

  markRemoveRelations = markedItemIds => {
    const { relationMode, itemIds, sendFormFieldChange } = this.props
    if (relationMode) {
      const tempRemoveItemIds = [...this.state.tempRemoveItemIds, ...markedItemIds]
      const tempItemIds = [...itemIds, ...this.state.tempAddItemIds].filter(itemId =>
        !tempRemoveItemIds.includes(itemId)
      )
      this.setState({tempRemoveItemIds})
      sendFormFieldChange(tempItemIds)
    }
  }

  unmarkRemoveRelations = unmarkedItemIds => {
    const { relationMode, itemIds, sendFormFieldChange } = this.props
    if (relationMode) {
      const tempRemoveItemIds = [...this.state.tempRemoveItemIds.filter(itemId => 
        !unmarkedItemIds.includes(itemId)
      )]
      const tempItemIds = [...itemIds, ...this.state.tempAddItemIds].filter(itemId =>
        !tempRemoveItemIds.includes(itemId)
      )
      sendFormFieldChange(tempItemIds)
      this.setState({tempRemoveItemIds})
    }
  }

  componentWillMount = () => {
    //if (!this.props.relationMode) console.log('LIST MOUNTED')
    const { items, relationMode, fetchItemsIfNeeded } = this.props
    if (fetchItemsIfNeeded) {
      relationMode ? fetchItemsIfNeeded() : fetchItemsIfNeeded() //this.props.fetchItems()
    }
    this.setState({ foundItems: items })
  }

  componentWillUnmount = () => {
    //if (!this.props.relationMode) console.log('LIST UNMOUNTED')
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.editMode !== nextProps.editMode) {
      this.setState({
        tempAddItemIds: [],
        tempRemoveItemIds: []
      })
    }
  }
  
  render = () => {
    const {
      categoryId,
      categoryLabel,
      settings,
      isFetchingSettings,
      isFetchingFields,
      itemIds,
      isFetchingItems,
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
      tempAddItemIds,
      tempRemoveItemIds,
      tableMode
    } = this.state

    const showingItems = Object.values(foundItems).filter(item => 
      tempAddItemIds.includes(item.id) || (itemIds ? itemIds.includes(item.id) : true)
    )

    const commonProps = {
      ...this.props,
      items: showingItems,
      searchQuery,
      openDetailDialog: this.openDetailDialog,
      tempAddItemIds,
      markRemoveItems: this.markRemoveRelations,
      unmarkRemoveItems: this.unmarkRemoveRelations,
      tempRemoveItemIds
    }

    return (
      <HeaderLayout
        relative={relationMode}
        relativeHeight={relationMode ? 200 : null}
        secondaryToolbar={relationMode}
        overflow={tableMode ? 'hidden' : 'auto'}
        title={categoryLabel}
        updateSearchQuery={!tableMode ? this.updateSearchQuery : null}
        loading={isFetchingSettings || isFetchingFields || isFetchingItems}
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
            id: 'viewAgenda',
            icon: ViewAgenda,
            description: 'Agenda View',
            hidden: !tableMode,
            right: true,
            onClick: () => this.changeView('agenda')
          },
          {
            id:'viewTable',
            icon:ViewList,
            description: 'Table View',
            hidden: tableMode,
            right: true,
            onClick: () => this.changeView('table')
          },
          {
            id:'addNewItem',
            icon: Add,
            hidden: relationMode,
            description: `New ${settings.itemLabel || 'Item'}`,
            right: true,
            onClick: this.openNewDialog
          },
          {
            id:'addExistentItem',
            icon: AddCircleOutline,
            hidden: !relationMode || !editMode,
            description: `New ${settings.itemLabel || 'Item'}`,
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
            closeDialog={this.closeDialog}
            history={history}
            categoryId={categoryId}
            itemLabel={settings.itemLabel}
          />
        </Dialog>

        {relationMode &&
          <Dialog
            open={showListDialog}
            onClose={this.closeDialog}
          >
            <CategoryList
              {...this.props}
              itemIds={this.props.items.map(item => item.id).filter(itemId =>
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
  itemIds: PropTypes.array,
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
  itemIds: null,
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
  return {
    settings: category.settings ? settings.byId[category.settings] : {},
    isFetchingSettings: settings.flow[categoryId].isFetching,
    fields: Object.values(fields.byId).filter(field => category.fields.includes(field.id)),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    items: Object.values(items.byId).filter(item => category.items.includes(item.id)),
    isFetchingItems: items.flow[categoryId].isFetchingAll,
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