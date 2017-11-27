import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { fetchItems, fetchItemsIfNeeded } from '../../actions/items'
import HeaderLayout from '../headerLayout'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import {
  DataTypeProvider,
  SelectionState,
  PagingState,
  LocalPaging,
  SortingState,
  LocalSorting,
  GroupingState,
  LocalGrouping,
  FilteringState,
  LocalFiltering,
  TableColumnResizing
} from '@devexpress/dx-react-grid'
import {
  Grid,
  VirtualTableView,
  TableHeaderRow,
  TableFilterRow,
  TableGroupRow,
  TableSelection,
  PagingPanel,
  DragDropContext,
  GroupingPanel
} from '@devexpress/dx-react-grid-material-ui'
import { TableRow } from 'material-ui/Table'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import { LinearProgress } from 'material-ui/Progress'
import Avatar from 'material-ui/Avatar'
import Add from 'material-ui-icons/Add'
import Delete from 'material-ui-icons/Delete'
import ViewList from 'material-ui-icons/ViewList'
import ViewAgenda from 'material-ui-icons/ViewAgenda'
import ArrowBack from 'material-ui-icons/ArrowBack'
import MoreVert from 'material-ui-icons/MoreVert'
import Dialog from 'material-ui/Dialog'
import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import escapeRegExp from 'escape-string-regexp'
import removeDiacritics from 'remove-diacritics'
import ItemDetail from './detail'
import ItemNew from './new'
import { getItemInfo } from './utils/helpers'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  listPadding: {
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
  listDense: {
    padding: 0
  },
  tableRow: {
    cursor: 'pointer',
    height: theme.standards.tableRowHeight
  },
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
  relativeSnackbar: {

  },
  snackbarContent: {
    width: '100%',
    flex: 1,
    maxWidth: 'inherit',
    flexWrap: 'inherit'
  }
})

let CategoryListContainer = class extends Component {
  state = {
    /* Agenda */
    agendaShowingItems: null,
    showMenuItem: false,
    itemMenuClicked: null,
    anchorEl: null,
    /* Table */
    tableSelectedIndexes: [],
    currentPage: 0,
    pageSize: 20,
    allowedPageSizes: [20,50,200,500,0],
    columnOrder: null,
    columnWidths: null
  }

  _updateSearchQuery = searchQuery => {
    const { settings, items } = this.props
    let agendaShowingItems = items
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim())
      const match = new RegExp(escapeRegExp(cleanQuery), 'i')
      agendaShowingItems = items.filter(item => (
        match.test(removeDiacritics(getItemInfo(settings.primaryFields, item)))
      ))
    }
    this.setState({ agendaShowingItems })
  }

  _changeCurrentPage = currentPage => this.setState({ currentPage })
  
  _changePageSize = pageSize => this.setState({ pageSize })

  _changeColumnOrder = columnOrder => this.setState({ columnOrder })

  _changeColumnWidths = columnWidths => this.setState({ columnWidths })

  _changeSelection = tableSelectedIndexes => this.setState({tableSelectedIndexes})

  _changeFiltering = filters => {
    console.log(filters)
  }

  _tableRowClick = (event,itemId) => {
    if (this.props.relationMode) {
      event.preventDefault()
      this.props.openDetailDialog(itemId)
    } else {
      const { categoryId, history } = this.props
      history.push(`${categoryId}/${itemId}`)
    }
  }

  _listItemClick(event, itemId) {
    if (this.props.relationMode) {
      event.preventDefault()
      this.props.openDetailDialog(itemId)
    }
  }

  _handleMenuItemClick = (event, itemId) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ showMenuItem: true, anchorEl: event.currentTarget, itemMenuClicked: itemId })
  }

  _handleMenuItemClose = () => {
    this.setState({ showMenuItem: false, itemMenuClicked: null })
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.searchQuery !== nextProps.searchQuery) {
      this._updateSearchQuery(nextProps.searchQuery)
    }
  }

  render = () => {
    const {
      classes,
      categoryId,
      tableMode,
      settings,
      fields,
      items,
      showAvatar,
      dense,
      relationMode
    } = this.props
    const { 
      tableSelectedIndexes,
      currentPage,
      pageSize,
      allowedPageSizes,
      columnWidths
    } = this.state
    
    const showingFields = fields.filter(field => field.views.list)
    const agendaShowingItems = this.state.agendaShowingItems || items

    const defaultColumnWidths = showingFields.reduce(
      (accumulator, currentField) => (
        {...accumulator, [currentField.id]: 100 * (currentField.views.list.ys || 1)}),
      {}
    )

    return (
      tableMode ? (
        <div>
          <Grid
            rows={items}
            columns={showingFields.map(field => {
              //https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/getting-started/
              return {
                title: field.label || '',
                name: field.id,
                dataType: field.type || 'string',
                align: field.type === 'number' ? 'right' : 'left'
              }
            })}
            getCellValue={ (row, columnName) => {
              const value = row[columnName]
              if (typeof value === 'object') {
                return Object.keys(value).toString()
              }
              return value
            }}
          >
            <DataTypeProvider
              type="string"
              formatterTemplate={({ value }) => 
                <span style={{ color: 'darkblue' }}>{value}</span>
              }
            />
            <DataTypeProvider
              type="progress"
              formatterTemplate={({ value }) => 
                <LinearProgress color="accent" mode="determinate" value={value} />
              }
            />
            <DataTypeProvider
              type="currency"
              formatterTemplate={({ value }) => 
                value ? 
                  <span style={{ color: 'darkblue' }}>${value}</span> :
                  null
              }
            />
            <DataTypeProvider
              type="date"
              formatterTemplate={({ value }) =>
                value.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1')}
            />
            <SortingState
              defaultSorting={[]}
            />
            <PagingState 
              defaultCurrentPage={0}
              currentPage={currentPage}
              onCurrentPageChange={this._changeCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this._changePageSize}
            />
            {!relationMode &&
              <FilteringState
                defaultFilters={[]}
                onFiltersChange={this._changeFiltering}
              />
            }
            {!relationMode &&
              <GroupingState
                defaultGroups={[]}
              />
            }
            <LocalSorting />
            {!relationMode && <LocalFiltering />}
            {!relationMode && <LocalGrouping />}
            <LocalPaging />
            {!relationMode && <DragDropContext />}
            <SelectionState
              defaultSelection={[]}
              onSelectionChange={this._changeSelection}
            />
            <VirtualTableView
              height={1280}
              allowColumnReordering={!relationMode}
              tableRowTemplate={({ children, row, tableRow }) => (
                <TableRow
                  hover
                  selected={tableSelectedIndexes.includes(tableRow.rowId)}
                  className={classes.tableRow}
                  onClick={event => this._tableRowClick(event,row.id)}
                >
                  {children}
                </TableRow>
              )}
            />
            {!relationMode &&
              <TableColumnResizing
                columnWidths={columnWidths || defaultColumnWidths}
                onColumnWidthsChange={this._changeColumnWidths}
              />
            }
            <TableHeaderRow
              allowSorting
              allowDragging={!relationMode}
              allowResizing={!relationMode}
              //allowGroupingByClick 
            />
            {!relationMode && <TableFilterRow />}
            <TableSelection />
            <PagingPanel
              allowedPageSizes={allowedPageSizes}
            />
            {!relationMode &&
              <GroupingPanel
                allowSorting
                allowDragging
                allowUngroupingByClick
              />
            }
            {!relationMode && <TableGroupRow />}
          </Grid>

          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(tableSelectedIndexes.length)}
            className={relationMode ? classes.relativeSnackbar : classes.snackbar}
            transitionDuration={{
              enter: 200,
              exit: 0
            }}
            SnackbarContentProps={{
              className: classes.snackbarContent
            }}
            message={
              <span>
                {tableSelectedIndexes.length} selected
              </span>
            }
            action={[
              <Button key="undo" color="accent" dense onClick={this.handleRequestClose}>
                UNDO
              </Button>,
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleRequestClose}
              >
                <Delete />
              </IconButton>
            ]}
          />
        </div>

      ) : (

        <div>
          <List
            classes={{
              padding:classes.listPadding,
              dense:classes.listDense
            }}
            dense={dense}
          >
            {agendaShowingItems.map(item =>
              <div key={item.id}>
                <Link
                  key={item.id}
                  tabIndex={-1}
                  to={relationMode ? `/${categoryId}/${item.id}#dialog` : `/${categoryId}/${item.id}`}
                  onClick={event => this._listItemClick(event, item.id)}
                >
                  <ListItem button disableRipple>
                    {showAvatar &&
                      <Avatar>
                        <Icon>{settings.icon}</Icon>
                      </Avatar>
                    }
                    <ListItemText
                      primary={getItemInfo(settings.primaryFields, item)}
                      secondary={getItemInfo(settings.secondaryFields, item)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Item Menu">
                        <MoreVert
                          onClick={ event => this._handleMenuItemClick(event, item.id)}
                        />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem> 
                </Link>
                <Divider/>
              </div>
            )}
          </List>
          <Menu
            elevation={4}
            transformOrigin={{ vertical: 'top', horizontal: 'left'}}
            anchorEl={this.state.anchorEl}
            open={this.state.showMenuItem}
            onRequestClose={this._handleMenuItemClose}
            className={classes.menu}
          >
            <MenuItem onClick={this._handleMenuItemClose}>
              View
            </MenuItem>
            <MenuItem onClick={this._handleMenuItemClose}>
              Edit
            </MenuItem>
            <MenuItem onClick={this._handleMenuItemClose}>
              Delete
            </MenuItem>
          </Menu>
        </div>
      )
    )
  }
}

CategoryListContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object,
  dense: PropTypes.bool,
  items: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  showAvatar: PropTypes.bool,
  relationMode: PropTypes.bool,
  openDetailDialog: PropTypes.func
}

CategoryListContainer.defaultProps = {
  showAvatar: true,
  dense: false,
  relationMode: false
}

CategoryListContainer = withStyles(styles)(CategoryListContainer)

/**
 * A list with category items, showed in the shape of table or agenda.
 */
class CategoryList extends Component {
  state = {
    searchQuery: '',
    showNewDialog: false,
    showDetailDialog: false,
    dialogItemId: '',
    tableMode: true
  }

  /**
	 * Update the state with the new search string indicated by the user.
	 * @public
   * @param {string} searchQuery The string.
   * @returns {void}
	 */
  _updateSearchQuery = searchQuery => this.setState({searchQuery})

  /**
	 * Change the view of the list.
	 * @public
   * @param {string} view The desired view. One of 'list','agenda'.
   * @returns {void}
	 */
  _changeView = view => this.setState({tableMode: view === 'list'})

  /**
	 * Open the new item dialog, updating the state.
	 * @public
	 * @returns {void}
	 */
  _openNewDialog = () => this.setState({ showNewDialog: true})

  /**
	 * Executed when new item dialog is closed.
	 * @public
	 * @returns {void}
	 */
  _newDialogClosed = () => this.closeNewDialog()

  /**
	 * Update the state indicating new item dialog is not showing.
	 * @public
   * @returns {void}
	 */
  closeNewDialog = () => this.setState({ showNewDialog: false})
  
  /**
	 * Open the detail item dialog, updating the state.
	 * @public
	 * @param {string} itemId Unique id of the item.
	 * @returns {void}
	 */
  openDetailDialog = itemId => this.setState({ showDetailDialog: true, dialogItemId: itemId})
  
  /**
	 * Executed when a detail item dialog is closed.
	 * @public
	 * @returns {void}
	 */
  detailDialogClosed = () => this.closeDetailDialog()

  /**
	 * Update the state indicating detail item dialog is not showing.
	 * @public
	 * @returns {void}
	 */
  closeDetailDialog = () => this.setState({ showDetailDialog: false})

  componentWillReceiveProps = nextProps => {
    this.setState({tableMode: nextProps.tableMode})
  }

  componentWillMount = () => {
    //if (!this.props.relationMode) console.log('LIST MOUNTED')
    this.props.relationMode ? this.props.fetchItemsIfNeeded() : this.props.fetchItems()
  }

  componentWillUnmount = () => {
    //if (!this.props.relationMode) console.log('LIST UNMOUNTED')
  }
  
  render = () => {
    const {
      categoryId,
      categoryLabel,
      settings,
      isFetchingSettings,
      fields,
      isFetchingFields,
      items,
      isFetchingItems,
      operations,
      relationMode,
      showAvatar,
      history
    } = this.props
    const {
      searchQuery,
      showNewDialog,
      showDetailDialog,
      dialogItemId,
      tableMode
    } = this.state

    return (
      <HeaderLayout
        miniToolbar={relationMode}
        relative={relationMode}
        relativeHeight={relationMode ? 200 : null}
        overflow={tableMode ? 'hidden' : 'auto'}
        title={categoryLabel}
        updateSearchQuery={!tableMode ? this._updateSearchQuery : null}
        loading={isFetchingSettings || isFetchingFields || isFetchingItems}
        operations={operations || [
          { 
            id:'arrowBack',
            icon:ArrowBack,
            hidden:relationMode,
            to:'/'
          },
          {
            id:'viewAgenda',
            icon:ViewAgenda,
            description:'Agenda View',
            hidden:!tableMode,
            right: true,
            onClick: () => this._changeView('agenda')
          },
          {
            id:'viewList',
            icon:ViewList,
            description:'Table View',
            hidden:tableMode,
            right: true,
            onClick: () => this._changeView('list')
          },
          {
            id:'addItem',
            icon:Add,
            description:`New ${settings.itemLabel || 'Item'}`,
            right: true, onClick: this._openNewDialog
          }
        ]}
      >
        {React.createElement(CategoryListContainer, {
          dense: relationMode,
          openDetailDialog: relationMode ? this.openDetailDialog : null,
          relationMode, categoryId, settings, items, fields,
          tableMode, showAvatar, history, searchQuery
        })}

        <Dialog fullScreen open={showNewDialog} onRequestClose={this._newDialogClosed}>
          <ItemNew closeDialog={this.closeNewDialog} categoryId={categoryId} itemLabel={settings.itemLabel}/>
        </Dialog>

        <Dialog fullWidth maxWidth="md" open={showDetailDialog} onRequestClose={this.detailDialogClosed}>
          <ItemDetail
            dialog
            itemId={dialogItemId}
            closeDialog={this.closeDetailDialog}
            categoryId={categoryId}
          />
        </Dialog>
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
   * All category fields. It only be shown fields with property 'view.list'.
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
     * If the field is required in detail view.
     */
    required: PropTypes.bool,
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
     * Keys can be: 'list', 'detail'.
     */ 
    views: PropTypes.objectOf(PropTypes.shape({
      list: PropTypes.objectOf({
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
   * 'viewAgenda', 'viewList' and 'addItem' (right).
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
   * If it should be shown avatar in agenda view.
   */
  showAvatar: PropTypes.bool
}

CategoryList.defaultProps = {
  settings: {},
  isFetchingSettings: false,
  fields: {},
  isFetchingFields: false,
  itemIds: null,
  items: [],
  isFetchingItems: false,
  relationMode: false,
  tableMode: true,
  showAvatar: true
}

const mapStateToProps = ({ categories, settings, fields, items }, props) => {
  const categoryId = props.categoryId
  const category = categories.byId[categoryId]
  return {
    settings: category.settings ? settings.byId[category.settings] : {},
    isFetchingSettings: settings.flow[categoryId].isFetching,
    fields: Object.values(fields.byId).filter(field => category.fields.includes(field.id)),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    items: Object.values(items.byId).filter(item => 
      category.items.includes(item.id) && (props.itemIds ? props.itemIds.includes(item.id) : true)
    ),
    isFetchingItems: items.flow[categoryId].isFetchingAll
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchItems: () => dispatch(fetchItems(props.categoryId)),
  fetchItemsIfNeeded: () => dispatch(fetchItemsIfNeeded(props.categoryId))
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)