import React, { Component } from 'react';
import Header from '../Header';
import { Link } from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter
} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import Plus from 'react-icons/lib/fa/plus';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import Search from 'react-icons/lib/fa/search';
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
    cursor: 'pointer',
    padding: '0 26px',
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
  static propTypes = {
    category: PropTypes.any,
    settings: PropTypes.object,
    items: PropTypes.array,
    operations: PropTypes.array,
    relationMode: PropTypes.bool,
    showAvatar: PropTypes.bool,
  }

  static defaultProps = {
    relationMode: false,
    showAvatar: false,
  }

  state = {
    searchQuery: '',
    showNewDialog: false,
    tableMode: true,
  }

  _openNewDialog() {
    this.setState({ showNewDialog: true});
  }

  closeNewDialog() {
    this.setState({ showNewDialog: false});
  }

  _newDialogClosed() {
    this.closeNewDialog();
  }

  _tableCellClicked(item) {
    window.location.assign(`/${this.props.category.name.toLowerCase()}/${item.id}`);
  }

  _updateSearchQuery(searchQuery) {
    this.setState({searchQuery});
  }

  _focusSearchInput() {
    this.searchInput.focus();
  }

  render() {
    const { category, settings, items, fields, operations, relationMode, showAvatar } = this.props;
    const { showNewDialog, searchQuery, tableMode } = this.state;

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

            <Toolbar style={styles.relationModeToolbar}>
              <ToolbarGroup>
                <ToolbarTitle style={styles.relationModeToolbarText} text={category.label}/>
              </ToolbarGroup>
              <ToolbarGroup lastChild={true}>
                <IconButton style={styles.relationModeToolbarIcon}>
                  <IconButton>
                    <Plus
                      size={16}
                      color={'#fff'}
                      onClick={_ => this._openNewDialog()}
                    />
                  </IconButton>
                </IconButton>
              </ToolbarGroup>
            </Toolbar>
            
          ) : (
            <Header
              title={category.label}
              operations={operations || [
                {id:'arrowLeft', icon:ArrowLeft, to:'/'},
                {id:'plus', icon:Plus, right: true, onClick: _ => this._openNewDialog()}
            ]}/>
          )
        }

        {/* Search Bar. */}
        <div style={styles.searchBar(relationMode)}>
          <Search
            size={20}
            color={"#999"}
            style={styles.searchBarIcon}
            onClick={ _ => this._focusSearchInput()}
          />
          <input
          style={styles.searchBarInput(relationMode)}
            ref={searchInput => this.searchInput = searchInput}
            type="text"
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
          tableMode ? ( <div>hola</div>
/*
            <Table
              multiSelectable={true}
              fixedHeader={true}
              fixedFooter={true}
              height={'300px'}
              onCellClick={ (row, column) => this._tableCellClicked(showingItems[row])}
            >
              <TableHeader
                displaySelectAll={true}
                enableSelectAll={true}
              >
              <TableRow>
                  {
                    fields.map(field =>
                      <TableHeaderColumn key={field.name}>
                        
                          {field.label}
                        
                      </TableHeaderColumn>
                    )
                  }
                </TableRow>
              </TableHeader>
              <TableBody showRowHover={true} style={{cursor:'pointer'}}>
                {
                  showingItems.map(item =>
                    <TableRow key={item.id} style={{height:'12px'}}>    
                      {
                        fields.map(field =>
                          <TableRowColumn
                            key={`${item.id}${field.name}`}
                          >
                            {item[field.name]}
                          </TableRowColumn>
                        )
                      }  
                    </TableRow>
                  )
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  {
                    fields.map(field =>
                      <TableHeaderColumn key={field.name}>{field.label}</TableHeaderColumn>
                    )
                  }
                </TableRow>
              </TableFooter>
            </Table>*/

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

        <Dialog
          fullScreen
          open={showNewDialog}
          onRequestClose={_ => this._newDialogClosed()}
          appBarStyle={{display: 'none'}}
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

export default CategoryList;
