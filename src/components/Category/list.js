import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
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
  ColumnOrderState,
  TableColumnResizing
} from '@devexpress/dx-react-grid'
import {
  Grid,
  TableView,
  TableHeaderRow,
  TableFilterRow,
  TableGroupRow,
  TableSelection,
  PagingPanel,
  DragDropContext,
  GroupingPanel
} from '@devexpress/dx-react-grid-material-ui'
import { LinearProgress } from 'material-ui/Progress'
import Avatar from 'material-ui/Avatar'
import Add from 'material-ui-icons/Add'
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
import { getInfo } from '../../utils/helpers'
import { withStyles } from 'material-ui/styles'

const containerStyles = () => ({
})

let CategoryListContainer = class extends Component {
  state = {
    showingItems: [],
    showMenuItem: false,
    itemMenuClicked: null,
    anchorEl: null,
    currentPage: 0,
    pageSize: 10,
    allowedPageSizes: [10,20,50,200,500,0],
    columnOrder: null,
    columnWidths: null
  }

  _updateSearchQuery = searchQuery => {
    const { settings, items } = this.props
    let showingItems = items
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim())
      const match = new RegExp(escapeRegExp(cleanQuery), 'i')
      showingItems = items.filter(item => (
        match.test(removeDiacritics(getInfo(settings.primaryFields, item)))
      ))
    }
    this.setState({ showingItems })
  }

  _changeCurrentPage = currentPage => this.setState({ currentPage })
  
  _changePageSize = pageSize => this.setState({ pageSize })

  _changeColumnOrder = columnOrder => this.setState({ columnOrder })

  _changeColumnWidths = columnWidths => this.setState({ columnWidths })

  _itemClick(event, relationMode, id) {
    if (relationMode) {
      event.preventDefault()
      this.props.openDetailDialog(id)
    }
  }

  _tableRowClick = (event, id) => {
    /*const { category, history } = this.props
    history.push(`${categoryId}/${id}`)*/
  }

  _tableRowKeyDown = (event, id) => {
    /*if (keycode(event) === 'space') {
      console.log("HOLA")
      this._tableRowClick(event, id)
    }*/
  }

  _handleMenuItemClick = (event, itemId) => {
    event.preventDefault()
    this.setState({ showMenuItem: true, anchorEl: event.currentTarget, itemMenuClicked: itemId })
  }

  _handleMenuItemClose = () => {
    this.setState({ showMenuItem: false, itemMenuClicked: null })
  }

  componentWillReceiveProps = props => {
    if (this.props.searchQuery !== props.searchQuery) {
      this._updateSearchQuery(props.searchQuery)
    } else {
      this.setState({showingItems: props.items})
    }
  }

  render = () => {
    const { classes, categoryId, tableMode, settings, fields, showAvatar, dense, relationMode } = this.props
    const { showingItems, currentPage, pageSize, allowedPageSizes, columnOrder, columnWidths } = this.state
    
    const showingFields = fields.filter(field => field.views.list)

    const defaultOrder = showingFields.map(field => field.id)
    const defaultColumnWidths = showingFields.reduce(
      (accumulator, currentField) => (
        {...accumulator, [currentField.id]: 100 * (currentField.views.list.ys || 1)}),
      {}
    )

    return (
      tableMode ? (
        <Grid
          rows={showingItems}
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
          <ColumnOrderState
            defaultOrder={defaultOrder}
            order={columnOrder || defaultOrder}
            onOrderChange={this._changeColumnOrder}
          />
          <DragDropContext />
          <SortingState
            defaultSorting={[]}
          />
          <LocalSorting />
          <GroupingState
            defaultGroups={[]}
          />
          <LocalGrouping />
          <PagingState 
            defaultCurrentPage={0}
            currentPage={currentPage}
            onCurrentPageChange={this._changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this._changePageSize}
          />
          <LocalPaging />
          <SelectionState
            defaultSelection={[]}
          />
          <FilteringState
            defaultFilters={[]}
          />
          <LocalFiltering />
          <TableView
            allowColumnReordering 
          />
          <TableSelection
            selectByRowClick 
          />
          <TableColumnResizing
            columnWidths={columnWidths || defaultColumnWidths}
            onColumnWidthsChange={this._changeColumnWidths}
          />
          <TableHeaderRow
            allowSorting
            allowDragging
            allowResizing
            //allowGroupingByClick 
          />
          <TableFilterRow
            rowHeight={28}
          />
          <TableGroupRow />
          <GroupingPanel
            allowSorting
            allowDragging
            allowUngroupingByClick
          />
          <PagingPanel
            allowedPageSizes={allowedPageSizes}
          />
        </Grid>

      ) : (

        <div>
          <List dense={dense}>
            {showingItems.map(item =>
              <div key={item.id}>
                <Link
                  key={item.id}
                  tabIndex={-1}
                  to={`/${categoryId}/${item.id}`}
                  onClick={ event => this._itemClick(event, relationMode, item.id)}
                >
                  <ListItem button>
                    {showAvatar &&
                      <Avatar>
                        <Icon>{settings.icon && React.createElement(settings.icon)}</Icon>
                      </Avatar>
                    }
                    <ListItemText
                      primary={getInfo(settings.primaryFields, item)}
                      secondary={getInfo(settings.secondaryFields, item)}
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

CategoryListContainer = withStyles(containerStyles)(CategoryListContainer)

/**
 * A list with category items, showed in the shape of table or agenda.
 */
class CategoryList extends Component {
  state = {
    searchQuery: '',
    showNewDialog: false,
    showDetailDialog: false,
    dialogItemId: '',
    tableMode: this.props.tableMode || true
  }

  _updateSearchQuery = searchQuery => this.setState({searchQuery})

  _changeView = view => this.setState({tableMode: view === 'list'})

  _openNewDialog = () => this.setState({ showNewDialog: true})

  _newDialogClosed = () => this.closeNewDialog()

  closeNewDialog = () => this.setState({ showNewDialog: false})

  openDetailDialog = itemId => this.setState({ showDetailDialog: true, dialogItemId: itemId})
  
  detailDialogClosed = () => this.closeDetailDialog()

  closeDetailDialog = () => this.setState({ showDetailDialog: false})

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
      showAvatar 
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
          relationMode, categoryId, settings, items, fields, tableMode, showAvatar, searchQuery
        })}

        <Dialog fullScreen open={showNewDialog} onRequestClose={this._newDialogClosed}>
          <ItemNew closeDialog={this.closeNewDialog} itemLabel={settings.itemLabel}/>
        </Dialog>

        <Dialog fullWidth maxWidth="md" open={showDetailDialog} onRequestClose={this.detailDialogClosed}>
          <ItemDetail
            dialog
            closeDialog={this.closeDetailDialog}
            id={dialogItemId}
            categoryId={categoryId}
            settings={settings}
            fields={fields}
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
   * It indicates if request to obtain settings is still active. It's used to show
   * the loading spinner until request finalizes.
   */
  isFetchingSettings: PropTypes.bool,
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
     * Description of field, Showed under field in detail views (if 'nodescription' is true).
     */
    description: PropTypes.string,
    /**
     * One of: 'string','text','number','boolean','list','select','relation'.
     * When type is 'list', there should be either 'items' or 'relation' property.
     * When type is 'select', there should be either 'options' or 'relation' property.
     */
    type: PropTypes.oneOf(['string','text','number','boolean','list','select','relation']),
    /**
     * Default value of the field.
     */
    default: PropTypes.any,
    /**
     * If the field is required in detail view.
     */
    required: PropTypes.bool,
    /**
     * Possible values when type is 'select'. Property 'relation' is also possible when
     * field is a one-to-many relation.
     */
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })),
    /**
     * Possible values when type is 'list'. Property 'relation' is also possible when
     * field is a one-to-many relation.
     */
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })),
    /**
     * Name of the relational category in the case of values obtain from other category.
     * With type 'select' is an one-to-many relation. With type 'relation' is a multiple relation.
     * It has priority over 'options' and 'items' properties.
     */
    relation: PropTypes.string,
    /**
     * Views where field appears, with its position and conditions.
     * They can be: 'list', 'detail'.
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
   * It indicates if request to obtain fields is still active. It's used to show
   * the loading spinner until request finalizes.
   */
  isFetchingFields: PropTypes.bool,
  /**
   * All category entities.
   */
  items: PropTypes.array,
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
  isFetchingFields: false,
  items: [],
  isFetchingItems: false,
  relationMode: false,
  tableMode: true,
  showAvatar: true
}

const mapStateToProps = ({ settings, fields, items }, props) => {
  return{ 
    settings: settings.byId[props.settingsId],
    isFetchingSettings: settings.flow.isFetching,
    fields: Object.values(fields.byId).filter(field => props.fieldsIds.includes(field.id)),
    isFetchingFields: fields.flow.isFetching,
    items: Object.values(items.byId).filter(item => props.itemsIds.includes(item.id)),
    isFetchingItems: items.flow.isFetching
  }
}

export default connect(mapStateToProps)(CategoryList)
