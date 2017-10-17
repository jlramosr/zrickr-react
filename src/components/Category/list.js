import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Toolbar from '../HeaderLayout/toolbar';
import Content from '../HeaderLayout/content';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TableSortLabel } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';
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
import Paper from 'material-ui/Paper';
import escapeRegExp from 'escape-string-regexp';
import removeDiacritics from 'remove-diacritics';
import ItemOverview from './overview';
import ItemNew from './new';
import { getInfo } from '../../utils/helpers';
import { withStyles } from 'material-ui/styles';

const containerStyles = theme => ({
  tableCell: {
    padding: 0,
    cursor: 'pointer',
  },
  menu: {
  },
})

class CategoryListContainer extends Component {
  state = {
    showingItems: [],
    itemsSelected: new Set([]),
    order: 'asc',
    orderBy: '',
    showMenuItem: false,
    itemMenuClicked: null,
    anchorEl: null,
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

  _updateSortColumn = property => event => {
    const orderBy = property;
    let order = 'asc';
    if (this.state.orderBy === property && this.state.order === 'asc') {
      order = 'desc';
    }
    const showingItems =
      order === 'asc'
        ? this.state.showingItems.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))
        : this.state.showingItems.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1));
    this.setState({showingItems, order, orderBy});
  }

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
    const { showingItems, itemsSelected, order, orderBy } = this.state;

    return (
      tableMode ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell checkbox>
                <Checkbox
                  indeterminate={itemsSelected.size > 0 && itemsSelected.size < showingItems.length}
                  checked={itemsSelected.size === showingItems.length}
                  onChange={this._tableSelectAllClick}
                />
              </TableCell>
              {fields.map(field =>
                <TableCell key={field.id} disablePadding>
                  <Tooltip title="Ordenar" enterDelay={300}>
                    <TableSortLabel
                      active={orderBy === field.id}
                      direction={order}
                      onClick={this._updateSortColumn(field.id)}
                    >
                      {field.label}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
          {showingItems.map(item => {
            const isSelected = this._isSelected(item.id);
            return (
              <TableRow
                key={item.id}
                hover
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={-1}
                selected={isSelected}
              >
                <TableCell checkbox>
                  <Checkbox
                    checked={isSelected}
                    onClick={event => this._tableSelectRowClick(event, item.id)}
                  />
                </TableCell>
                {fields.map(field =>      
                  <TableCell
                    key={`${item.id}${field.id}`}
                    className={classes.tableCell}
                    onClick={event => this._tableRowClick(event, item.id)}
                    onKeyDown={event => this._tableRowKeyDown(event, item.id)}
                  >
                    {typeof item[field.id] === 'object' ? JSON.stringify(item[field.id]) : item[field.id]}
                  </TableCell>
                )}  
              </TableRow>
            )
          })}
          </TableBody>
          <TableFooter>
            <TableRow>
            {fields.map(field =>
              <TableCell key={field.id}>{field.label}</TableCell>
            )}
            </TableRow>
          </TableFooter>
        </Table>

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

const listStyles = theme => ({
  appBar: { 
    display: 'flex',
    justifyContent: 'center',
    height: 30,
    background: theme.palette.primary[800],
  },
  toolbar: { 
    padding: theme.spacing.unit*2,
  },
  typography: { 
    color: theme.palette.secondary[400],
  },
  paper: { 
    height: 300,
    overflow: 'auto',
  }
});

class CategoryList extends Component {
  state = {
    searchQuery: '',
    showNewDialog: false,
    showOverviewDialog: false,
    overviewItemId: '',
    tableMode: false,
  }

  _updateSearchQuery = searchQuery => this.setState({searchQuery});

  //, itemsSelected:new Set([])
  _changeView = view => this.setState({tableMode: view === 'list'});

  _openNewDialog = _ => this.setState({ showNewDialog: true});

  _newDialogClosed = _ => this.closeNewDialog();

  closeNewDialog = _ => this.setState({ showNewDialog: false});

  openOverviewDialog = itemId => this.setState({ showOverviewDialog: true, overviewItemId: itemId});
  
  overviewDialogClosed = _ => this.closeOverviewDialog();
  
  closeOverviewDialog = _ => this.setState({ showOverviewDialog: false});

  render = _ => {
    const { classes, categoryId, categoryLabel, settings, items, fields, operations, relationMode, showAvatar, loading } = this.props;
    const { searchQuery, showNewDialog, showOverviewDialog, overviewItemId, tableMode } = this.state;

    return (
      <div>
        {relationMode ? (
          <div>
            <Toolbar
              title={categoryLabel}
              position="static"
              updateSearchQuery={this._updateSearchQuery}
              loading={loading}
              operations={operations || [
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
            />
            <Paper className={classes.paper}>
              <CategoryListContainer
                dense
                relationMode
                openOverviewDialog={this.openOverviewDialog}
                categoryId={categoryId}
                settings={settings}
                items={items}
                fields={fields}
                tableMode={tableMode}
                showAvatar={showAvatar}
                searchQuery={searchQuery}
              >
              </CategoryListContainer>
            </Paper>
          </div>
        ) : (
          <div>
            <Toolbar
              title={categoryLabel}
              updateSearchQuery={this._updateSearchQuery}
              loading={loading}
              operations={operations || [
                { 
                  id:'arrowBack',
                  icon:ArrowBack,
                  to:'/'
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
            />

            <Content>
              <CategoryListContainer
                categoryId={categoryId}
                settings={settings}
                items={items}
                fields={fields}
                tableMode={tableMode}
                showAvatar={showAvatar}
                searchQuery={searchQuery}
              >
              </CategoryListContainer>
            </Content>
          </div>
        )}

        <Dialog
          fullScreen
          open={showNewDialog}
          onRequestClose={this._newDialogClosed}
        >
          <ItemNew
            closeDialog={this.closeNewDialog}
            itemLabel={settings.itemLabel}
          />
        </Dialog>

        <Dialog
          fullScreen
          open={showOverviewDialog}
          onRequestClose={this.overviewDialogClosed}
        >
          <ItemOverview
            closeDialog={this.closeOverviewDialog}
            id={overviewItemId}
            categoryId={categoryId}
            settings={settings}
            fields={fields}
          />
        </Dialog>

      </div>
    )
  };
}

CategoryList.propTypes = {
  classes: PropTypes.object.isRequired,
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

export default withStyles(listStyles)(CategoryList);
