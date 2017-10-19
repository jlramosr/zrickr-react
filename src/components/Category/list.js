import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import HeaderLayout from '../HeaderLayout';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
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
  TableColumnResizing,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableView,
  TableHeaderRow,
  TableFilterRow,
  TableGroupRow,
  TableSelection,
  PagingPanel,
  DragDropContext,
  GroupingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { LinearProgress } from 'material-ui/Progress';
import Avatar from 'material-ui/Avatar';
import Add from 'material-ui-icons/Add';
import ViewList from 'material-ui-icons/ViewList';
import ViewAgenda from 'material-ui-icons/ViewAgenda';
import ArrowBack from 'material-ui-icons/ArrowBack';
import MoreVert from 'material-ui-icons/MoreVert';
import Dialog from 'material-ui/Dialog';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import escapeRegExp from 'escape-string-regexp';
import removeDiacritics from 'remove-diacritics';
import ItemOverview from './overview';
import ItemNew from './new';
import { getInfo } from '../../utils/helpers';
import { withStyles } from 'material-ui/styles';

const containerStyles = theme => ({
})

class CategoryListContainer extends Component {
  state = {
    showingItems: [],
    showMenuItem: false,
    itemMenuClicked: null,
    anchorEl: null,
    currentPage: 0,
    pageSize: 10,
    allowedPageSizes: [10,20,50,200,500,0],
    columnOrder: null,
    columnWidths: null,
    itemsSelected: new Set([]),
  }

  _updateSearchQuery = searchQuery => {
    const { settings, items } = this.props;
    let showingItems = items;
    let itemsSelected = this.state.itemsSelected;
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim());
      const match = new RegExp(escapeRegExp(cleanQuery), 'i');
      showingItems = items.filter(item => (
        match.test(removeDiacritics(getInfo(settings.primaryFields, item)))
      ))
      itemsSelected = new Set(showingItems
        .filter(item => this._isSelected(item.id))
        .map(item => item.id)
      );
    }
    this.setState({showingItems, itemsSelected})
  };

  _changeCurrentPage = currentPage => this.setState({ currentPage });
  
  _changePageSize = pageSize => this.setState({ pageSize });

  _changeColumnOrder = columnOrder => this.setState({ columnOrder });

  _changeColumnWidths = columnWidths => this.setState({ columnWidths });

  _tableSelectAllClick = (event, checked) =>
    this.setState({itemsSelected: new Set(checked ? this.state.showingItems.map(item => item.id) : [])});

  _tableSelectRowClick = (event, id) => {
    this.setState(prevState => {
      let itemsSelected = prevState.itemsSelected;
      let isRowSelected = itemsSelected.delete(id);
      return { itemsSelected: isRowSelected ? itemsSelected : itemsSelected.add(id) }
    })
  }

  _itemClick(event, relationMode, id) {
    if (relationMode) {
      event.preventDefault();
      this.props.openOverviewDialog(id);
    }
  }

  _tableRowClick = (event, id) => {
    /*const { category, history } = this.props;
    history.push(`${categoryId}/${id}`)*/
  }

  _tableRowKeyDown = (event, id) => {
    /*if (keycode(event) === 'space') {
      console.log("HOLA");
      this._tableRowClick(event, id);
    }*/
  }

  _isSelected = id => this.state.itemsSelected.has(id);

  _handleMenuItemClick = (event, itemId) => {
    event.preventDefault();
    this.setState({ showMenuItem: true, anchorEl: event.currentTarget, itemMenuClicked: itemId });
  };

  _handleMenuItemClose = () => {
    this.setState({ showMenuItem: false, itemMenuClicked: null });
  };

  componentWillReceiveProps = props => {
    if (this.props.searchQuery !== props.searchQuery) {
      this._updateSearchQuery(props.searchQuery);
    } else {
      this.setState({showingItems: props.items});
    }
  }

  render = _ => {
    const { classes, categoryId, tableMode, settings, fields, showAvatar, dense, relationMode } = this.props;
    const { showingItems, currentPage, pageSize, allowedPageSizes, columnOrder, columnWidths, itemsSelected } = this.state;
    
    const defaultOrder = fields.map(field => field.id);
    const defaultColumnWidths = fields.reduce(
      (accumulator, currentField) => (
        {...accumulator, [currentField.id]: 100 * (currentField.views.list.ys || 1)}),
      {}
    );

    return (
      tableMode ? (
        <Grid
          rows={showingItems}
          columns={fields.map(field => {
            //https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/getting-started/
            return {
              title: field.label,
              name: field.id,
              dataType: field.type || 'string',
              align: field.type === 'number' ? 'right' : 'left',
            };
          })}
          getCellValue={ (row, columnName) => {
            const value = row[columnName];
            if (typeof value === 'object') {
              return Object.keys(value).toString();
            }
            return value;
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
            transformOrigin={{ vertical: 'top', horizontal: 'left',}}
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
    );
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
  openOverviewDialog: PropTypes.func,
}

CategoryListContainer.defaultProps = {
  showAvatar: true,
  dense: false,
  relationMode: false,
}

CategoryListContainer = withStyles(containerStyles)(CategoryListContainer);

class CategoryList extends Component {
  state = {
    searchQuery: '',
    showNewDialog: false,
    showOverviewDialog: false,
    dialogItemId: '',
    tableMode: true,
  }

  _updateSearchQuery = searchQuery => this.setState({searchQuery});

  //, itemsSelected:new Set([])
  _changeView = view => this.setState({tableMode: view === 'list'});

  _openNewDialog = _ => this.setState({ showNewDialog: true});

  _newDialogClosed = _ => this.closeNewDialog();

  closeNewDialog = _ => this.setState({ showNewDialog: false});

  openOverviewDialog = itemId => this.setState({ showOverviewDialog: true, dialogItemId: itemId});
  
  overviewDialogClosed = _ => this.closeOverviewDialog();
  
  closeOverviewDialog = _ => this.setState({ showOverviewDialog: false});

  render = _ => {
    const { categoryId, categoryLabel, settings, items, fields, operations, relationMode, showAvatar, loading } = this.props;
    const { searchQuery, showNewDialog, showOverviewDialog, dialogItemId, tableMode } = this.state;

    return (
      <HeaderLayout
        miniToolbar={relationMode}
        relative={relationMode}
        relativeHeight={relationMode ? 200 : null}
        title={categoryLabel}
        updateSearchQuery={!tableMode && this._updateSearchQuery}
        loading={loading}
        operations={operations || [
          { 
            id:'arrowBack',
            icon:ArrowBack,
            hidden:relationMode,
            to:'/',
          },
          {
            id:'viewAgenda',
            icon:ViewAgenda,
            description:'Vista agenda',
            hidden:!tableMode,
            right: true,
            onClick: _ => this._changeView('agenda'),
          },
          {
            id:'viewList',
            icon:ViewList,
            description:'Vista tabla',
            hidden:tableMode,
            right: true,
            onClick: _ => this._changeView('list'),
          },
          {
            id:'addItem',
            icon:Add,
            description:`Nuevo ${settings.itemLabel || 'Item'}`,
            right: true, onClick: this._openNewDialog
          },
        ]}
      >
        {React.createElement(CategoryListContainer, {
          dense: relationMode,
          openOverviewDialog: relationMode ? this.openOverviewDialog : null,
          relationMode, categoryId, settings, items, fields, tableMode, showAvatar, searchQuery
        })}

        <Dialog fullScreen open={showNewDialog} onRequestClose={this._newDialogClosed}>
          <ItemNew closeDialog={this.closeNewDialog} itemLabel={settings.itemLabel}/>
        </Dialog>

        <Dialog fullWidth maxWidth="md" open={showOverviewDialog} onRequestClose={this.overviewDialogClosed}>
          <ItemOverview
            dialog
            closeDialog={this.closeOverviewDialog}
            id={dialogItemId}
            categoryId={categoryId}
            settings={settings}
            fields={fields}
          />
        </Dialog>
      </HeaderLayout>
    )
  };
}

CategoryList.propTypes = {
  categoryId: PropTypes.string.isRequired,
  categoryLabel: PropTypes.string.isRequired,
  settings: PropTypes.object,
  fields: PropTypes.array,
  items: PropTypes.array,
  operations: PropTypes.array,
  relationMode: PropTypes.bool.isRequired,
  showAvatar: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
}

CategoryList.defaultProps = {
  relationMode: false,
  showAvatar: true,
  loading: true,
}

export default CategoryList;
