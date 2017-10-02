import React, { Component } from 'react';
import Header from '../Header';
import { Link } from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TableSortLabel } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';
import Avatar from 'material-ui/Avatar';
import Add from 'material-ui-icons/Add';
import ArrowBack from 'material-ui-icons/ArrowBack';
import Search from 'material-ui-icons/Search';
import Dialog from 'material-ui/Dialog';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { MenuItem } from 'material-ui/Menu';
import ItemNew from './new';
import escapeRegExp from 'escape-string-regexp';
import removeDiacritics from 'remove-diacritics';
import { getInfo } from './helpers';
import PropTypes from 'prop-types';

const styles = {
  relationModeToolbar: {
    background: '#004545',
    height: '32px',
    lineHeight: '20px',
    marginTop: '20px',
  },

  relationModeToolbarText: {
    color: '#fff',
    fontSize: '16px'
  },

  relationModeToolbarIcon: {
    margin: '-22px 25px 0 0'
  },

  searchBar: relationMode => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 
      relationMode ?
        '-6px 8px 46px -13px rgba(0,0,0,0.75)' :
        '0 10px 20px rgba(0,0,0,0.19), 0 0 6px rgba(0,0,0,0.23)',
  }),
  
  searchBarIcon: {
    paddingLeft: 36,
    paddingRight: 14,
  },
  
  searchBarInput: relationMode => ({
    flex: 1,
    height: relationMode ? '30px' : '40px',
    outline: 'none',
    border: 'none',
    fontSize: '16px',
  }),
  
  searchBarResults: {
    padding: '0 30px',
    alignContent: 'right',
    color: '#999',
  },

  list: relationMode => ({
    padding: relationMode ? '0' : '8px 0',
  }),
  
  listLink: {
    outline: 'none',
  },

  listItem : showAvatar => ({
    paddingLeft: showAvatar ? '72px': '28px'
  }),

  menuItem:{
    color: "#00838F",
    fontSize: "14px"
  },

  listMenuItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: "8px",
  },

  iconMenu: {
    paddingRight: "8px"
  },

  avatar: showAvatar => ({
    display: showAvatar ? 'block' : 'none',
  })

}

const iconButtonElement = (
  <IconButton tabIndex={-1}>
    <Icon color={"#999"}>more_vert_icon</Icon>
  </IconButton>
);

const rightIconMenu = (
  <Icon
    autoWidth={false}
    onClick={ event => {
      event.preventDefault();
    }}
    style={styles.iconMenu}
    listStyle={styles.listMenuItem}
    iconButtonElement={iconButtonElement}
  >
    <MenuItem style={styles.menuItem}>View</MenuItem>
    <MenuItem style={styles.menuItem}>Edit</MenuItem>
    <MenuItem style={styles.menuItem}>Delete</MenuItem>
  </Icon>
);

class CategoryList extends Component {
  state = {
    searchQuery: '',
    showNewDialog: false,
    tableMode: true,
    itemsSelected: new Set([]),
    order: 'asc',
    orderBy: 'name',
  }

  _openNewDialog = _ => this.setState({ showNewDialog: true});

  _newDialogClosed = _ => this.closeNewDialog();

  closeNewDialog = _ => this.setState({ showNewDialog: false});

  _updateSearchQuery = searchQuery => this.setState({searchQuery});

  _focusSearchInput = _ => this.searchInput.focus();

  _tableSelectAllClick = (event, checked) =>
    this.setState({itemsSelected: new Set(checked ? this.props.items.map(item => item.id) : [])});

  _tableSelectRowClick = (event, id) => {
    this.setState(prevState => {
      let itemsSelected = prevState.itemsSelected;
      let isRowSelected = itemsSelected.delete(id);
      return { itemsSelected: isRowSelected ? itemsSelected : itemsSelected.add(id) }
    })
  };

  _tableRowClick = (event, id) => {
    const { category, history } = this.props;
    history.push(`${category.name}/${id}`)
  };

  _tableRowKeyDown = (event, id) => {
    /*if (keycode(event) === 'space') {
      console.log("HOLA");
      this._tableRowClick(event, id);
    }*/
  };

  _isSelected = id => this.state.itemsSelected.has(id);

  _createSortHandler = property => event => {
    const orderBy = property;
    let order = 'asc';

    if (this.state.orderBy === property && this.state.order === 'asc') {
      order = 'desc';
    }

    const items =
      order === 'asc'
        ? this.props.items.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))
        : this.props.items.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1));

    this.setState({ items, order, orderBy });
  };

  render() {
    const { category, settings, items, fields, operations, relationMode, showAvatar } = this.props;
    const { showNewDialog, searchQuery, tableMode, itemsSelected, order, orderBy } = this.state;

    let showingItems;
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim());
      const match = new RegExp(escapeRegExp(cleanQuery), 'i');
      showingItems = items.filter(item => (
        match.test(removeDiacritics(getInfo(settings.primaryFields, item)))
      ))
    } else {
      showingItems = items;
    }

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
            ]}/>
            
          ) : (
            <Header
              title={category.label}
              operations={operations || [
                {id:'arrowBack', icon:ArrowBack, to:'/'},
                {id:'add', icon:Add, right: true, onClick: _ => this._openNewDialog()}
            ]}/>
          )
        }

        {/* Search Bar. */}
        <div style={styles.searchBar(relationMode)}>
          <Search
            size={20}
            color={"#999"}
            style={styles.searchBarIcon}
          />
          <input
          style={styles.searchBarInput(relationMode)}
            ref={searchInput => this.searchInput = searchInput}
            type="search"
            placeholder="Buscar"
            value={searchQuery}
            onChange={ event => this._updateSearchQuery(event.target.value) }/>
          <div style={styles.searchBarResults} hidden={
            !(searchQuery && showingItems.length !== 0 && showingItems.length !== items.length)
          }>
            {`Mostrando ${showingItems.length} resultados`}
          </div>
          <div style={styles.searchBarResults} hidden={
            !(searchQuery && showingItems.length === 0)
          }>
            No se han encontrado coincidencias
          </div>
        </div>

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
                        <Tooltip title="Ordenar" placement="bottom-start" enterDelay={300}>
                          <TableSortLabel
                            active={orderBy === field.name}
                            direction={order}
                            onClick={this._createSortHandler(field.name)}
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

            <List style={styles.list(relationMode)}> 
              {
                showingItems.map(item =>
                  <Link
                    key={item.id}
                    tabIndex={-1}
                    style={styles.listLink}
                    to={`/${category.name.toLowerCase()}/${item.id}`}
                  >
                    
                    <ListItem
                      innerDivStyle={styles.listItem(showAvatar)}
                      primaryText={getInfo(settings.primaryFields, item)}
                      secondaryText={getInfo(settings.secondaryFields, item)}
                      leftAvatar={ 
                        <Avatar style={styles.avatar(showAvatar)} src={item.photo}/>
                      }
                      hoverColor="#E0F2F1"
                      rightIconButton={rightIconMenu}
                    />
                    <Divider inset={false}/>
                    
                  </Link>
                )
              }
            </List>

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
