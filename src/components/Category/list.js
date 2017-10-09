import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import HeaderLayout from '../HeaderLayout';
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
import escapeRegExp from 'escape-string-regexp';
import removeDiacritics from 'remove-diacritics';
import ItemNew from './new';
import { getInfo } from '../../utils/helpers';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  relationModeToolbar: {
  },
  relationModeToolbarText: {
  },
  relationModeToolbarIcon: {
  },

  listLink: {
  },
  listMenuItem: {
  },
  tableCell: {
    padding: 0,
    cursor: 'pointer',
  },
  menuItemOperation:{
  },
  iconMenu: {
  },
})

class CategoryList extends Component {
  state = {
    searchQuery: '',
    showingItems: [],
    showNewDialog: false,
    tableMode: false,
    itemsSelected: new Set([]),
    order: 'asc',
    orderBy: '',
    showMenuItem: false,
    itemMenuClicked: null,
    anchorEl: null,
  }

  updateSearchQuery = searchQuery => {
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
    this.setState({showingItems, searchQuery, itemsSelected})
  };

  _changeView = view => this.setState({tableMode: view === 'list', itemsSelected:new Set([])});

  _openNewDialog = _ => this.setState({ showNewDialog: true});

  _newDialogClosed = _ => this.closeNewDialog();

  closeNewDialog = _ => this.setState({ showNewDialog: false});

  _focusSearchInput = _ => this.searchInput.focus();

  _tableSelectAllClick = (event, checked) =>
    this.setState({itemsSelected: new Set(checked ? this.state.showingItems.map(item => item.id) : [])});

  _tableSelectRowClick = (event, id) => {
    this.setState(prevState => {
      let itemsSelected = prevState.itemsSelected;
      let isRowSelected = itemsSelected.delete(id);
      return { itemsSelected: isRowSelected ? itemsSelected : itemsSelected.add(id) }
    })
  }

  _tableRowClick = (event, id) => {
    const { category, history } = this.props;
    history.push(`${category.name}/${id}`)
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

  componentDidMount = _ => {
    this.setState({showingItems: this.props.items});
  }

  render = _ => {
    const { category, settings, fields, operations, relationMode, showAvatar, classes, loading } = this.props;
    const { showNewDialog, showingItems, tableMode, itemsSelected, order, orderBy } = this.state;

    return (
      <HeaderLayout
        title={category.label}
        position={relationMode ? "static" : "fixed"}
        updateSearchQuery={relationMode ? null : this.updateSearchQuery}
        loading={loading}
        operations={operations || [ 
          relationMode ? 
            {
              id:'addRelation',
              icon:Add,
              right: true,
              onClick: _ => this._openNewDialog()
            }
          :
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
              right: true, onClick: _ => this._openNewDialog()
            },
        ]}
      >
        
      {tableMode ? (
        <Table height={'300px'}>
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
                <TableCell key={field.name} disablePadding>
                  <Tooltip title="Ordenar" enterDelay={300}>
                    <TableSortLabel
                      active={orderBy === field.name}
                      direction={order}
                      onClick={this._updateSortColumn(field.name)}
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
                    key={`${item.id}${field.name}`}
                    className={classes.tableCell}
                    onClick={event => this._tableRowClick(event, item.id)}
                    onKeyDown={event => this._tableRowKeyDown(event, item.id)}
                  >
                    {item[field.name]}
                  </TableCell>
                )}  
              </TableRow>
            )
          })}
          </TableBody>
          <TableFooter>
            <TableRow>
            {fields.map(field =>
              <TableCell key={field.name}>{field.label}</TableCell>
            )}
            </TableRow>
          </TableFooter>
        </Table>

      ) : (

        <div>
          <List>
          {showingItems.map(item =>
            <Link
              key={item.id}
              tabIndex={-1}
              className={classes.listLink}
              to={`/${category.name.toLowerCase()}/${item.id}`}
            >
              <ListItem button>
                {showAvatar &&
                  <Avatar>
                    <Icon>{React.createElement(category.icon)}</Icon>
                  </Avatar>
                }
                <ListItemText
                  primary={getInfo(settings.primaryFields, item)}
                  secondary={getInfo(settings.secondaryFields, item)}
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Item Menu">
                    <MoreVert
                      className={classes.iconMenu}
                      onClick={ event => this._handleMenuItemClick(event, item.id)}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider/>
            </Link>
          )}
          </List>
          <Menu
            elevation={4}
            transformOrigin={{ vertical: 'top', horizontal: 'left',}}
            anchorEl={this.state.anchorEl}
            open={this.state.showMenuItem}
            onRequestClose={this._handleMenuItemClose}
            className={classes.listMenuItem}
          >
            <MenuItem className={classes.menuItemOperation} onClick={this._handleMenuItemClose}>
              View
            </MenuItem>
            <MenuItem className={classes.menuItemOperation} onClick={this._handleMenuItemClose}>
              Edit
            </MenuItem>
            <MenuItem className={classes.menuItemOperation} onClick={this._handleMenuItemClose}>
              Delete
            </MenuItem>
          </Menu>
        </div>
      )}

      <Dialog
        fullScreen
        open={showNewDialog}
        onRequestClose={_ => this._newDialogClosed()}
      >
        <ItemNew
          title={`Nuevo ${settings.itemLabel || 'Item'}`}
          closeDialog={_ => this.closeNewDialog()}
        />
      </Dialog>

    </HeaderLayout>
    );
  }
}

CategoryList.propTypes = {
  category: PropTypes.any,
  settings: PropTypes.object,
  items: PropTypes.array,
  operations: PropTypes.array,
  relationMode: PropTypes.bool,
  showAvatar: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
}

CategoryList.defaultProps = {
  relationMode: false,
  showAvatar: false,
  loading: true,
}

export default withStyles(styles)(CategoryList);
