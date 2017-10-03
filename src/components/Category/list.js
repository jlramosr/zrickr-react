import React, { Component } from 'react';
import Header from '../Header';
import { Link } from 'react-router-dom';
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
import ItemNew from './new';
import escapeRegExp from 'escape-string-regexp';
import removeDiacritics from 'remove-diacritics';
import { getInfo } from './helpers';
import PropTypes from 'prop-types';

const styles = {
  relationModeToolbar: {
    background: '#004545',
    height: 32,
    lineHeight: 20,
    marginTop: 20,
  },

  relationModeToolbarText: {
    color: '#fff',
    fontSize: 16,
  },

  relationModeToolbarIcon: {
    margin: '-22px 25px 0 0'
  },
  
  listLink: {
    outline: 'none',
  },

  listMenuItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
  },

  menuItemOperation:{
    fontSize: 12,
    height: 12
  },

  iconMenu: {
    paddingRight: 8,
  },

}

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

  componentDidMount() {
    this.setState({showingItems: this.props.items});
  }

  render() {
    const { category, settings, fields, operations, relationMode, showAvatar } = this.props;
    const { showNewDialog, showingItems, tableMode, itemsSelected, order, orderBy } = this.state;

    return (
      <div>
        {
          // Header.
          relationMode ? (
            <Header
              title={category.label}
              position="static"
              operations={operations || [
                {id:'add', icon:Add, right: true, onClick: _ => this._openNewDialog()}
              ]}
            />
            
          ) : (
            <Header
              title={category.label}
              updateSearchQuery={this.updateSearchQuery}
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
                  id:'add',
                  icon:Add,
                  description:`Nuevo ${category.itemLabel}`,
                  right: true, onClick: _ => this._openNewDialog()},
              ]}
            />
          )
        }

        {
          // List.
          tableMode ? (

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
                  {
                    fields.map(field =>
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
                    )
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  showingItems.map(item => {
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
                        {
                          fields.map(field =>      
                            <TableCell
                              key={`${item.id}${field.name}`}
                              style={{cursor:'pointer', padding: 0}}
                              onClick={event => this._tableRowClick(event, item.id)}
                              onKeyDown={event => this._tableRowKeyDown(event, item.id)}
                            >
                              {item[field.name]}
                            </TableCell>
                          )
                        }  
                      </TableRow>
                    )
                  })
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  {
                    fields.map(field =>
                      <TableCell key={field.name}>{field.label}</TableCell>
                    )
                  }
                </TableRow>
              </TableFooter>
            </Table>

          ) : (

            <div>
              <List>
                {
                  showingItems.map(item =>
                    <Link
                      key={item.id}
                      tabIndex={-1}
                      style={styles.listLink}
                      to={`/${category.name.toLowerCase()}/${item.id}`}
                    >
                      <ListItem button>
                        { 
                          showAvatar &&
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
                              style={styles.iconMenu}
                              onClick={ event => this._handleMenuItemClick(event, item.id)}
                            />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider/>
                    </Link>
                  )
                }
              </List>
              <Menu
                elevation={4}
                transformOrigin={{ vertical: 'top', horizontal: 'left',}}
                anchorEl={this.state.anchorEl}
                open={this.state.showMenuItem}
                onRequestClose={this._handleMenuItemClose}
                style={styles.listMenuItem}
              >
                <MenuItem style={styles.menuItemOperation} onClick={this._handleMenuItemClose}>
                  View
                </MenuItem>
                <MenuItem style={styles.menuItemOperation} onClick={this._handleMenuItemClose}>
                  Edit
                </MenuItem>
                <MenuItem style={styles.menuItemOperation} onClick={this._handleMenuItemClose}>
                  Delete
                </MenuItem>
              </Menu>
            </div>
          )
        }

        {/* New Item Dialog. */}
        <Dialog
          fullScreen
          open={showNewDialog}
          onRequestClose={_ => this._newDialogClosed()}
        >
          <ItemNew
            title={`Nuevo ${category.itemLabel}`}
            closeDialog={_ => this.closeNewDialog()}
          />
        </Dialog>

      </div>
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
}

CategoryList.defaultProps = {
  relationMode: false,
  showAvatar: false,
}

export default CategoryList;
