import React, { Component } from 'react';
import Header from '../Header';
import { Link } from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import Plus from 'react-icons/lib/fa/plus';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import Search from 'react-icons/lib/fa/search';
import FullscreenDialog from 'material-ui-fullscreen-dialog';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ItemNew from './new';
import escapeRegExp from 'escape-string-regexp';
import removeDiacritics from 'remove-diacritics';
import { getInfo } from './helpers';
import PropTypes from 'prop-types';

const styles = {
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

  formTextHeader: {
    background: '#004545',
    color: '#fff',
    padding: '12px 28px',
    lineHeight: '20px',
    marginTop: '20px',
  },

  searchBar: form => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 
      form ?
        '-6px 8px 46px -13px rgba(0,0,0,0.75)' :
        '0 10px 20px rgba(0,0,0,0.19), 0 0 6px rgba(0,0,0,0.23)',
  }),
  
  searchBarIcon: {
    cursor: 'pointer',
    padding: '0 26px',
  },
  
  searchBarInput: form => ({
    flex: 1,
    height: form ? '30px' : '40px',
    outline: 'none',
    border: 'none',
    fontSize: '16px',
  }),
  
  searchBarResults: {
    padding: '0 30px',
    alignContent: 'right',
    color: '#999',
  },

  list: form => ({
    padding: form ? '0' : '8px 0',
  }),
  
  listLink: {
    outline: 'none',
  },

}

const iconButtonElement = (
  <IconButton tabIndex={-1}>
    <MoreVertIcon color={"#999"}/>
  </IconButton>
);

const rightIconMenu = (
  <IconMenu
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
  </IconMenu>
);

class CategoryList extends Component {
  static propTypes = {
    category: PropTypes.any,
    settings: PropTypes.object,
    items: PropTypes.array,
    operations: PropTypes.array,
    form: PropTypes.bool
  }

  static defaultProps = {
    form: false
  }

  state = {
    searchQuery: '',
    showNewDialog: false
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

  _updateSearchQuery(searchQuery) {
    this.setState({searchQuery});
  }

  _focusSearchInput() {
    this.searchInput.focus();
  }

  render() {
    const { category, settings, items, operations, form } = this.props;
    const { showNewDialog, searchQuery } = this.state;

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
          form ? (
            <Subheader style={styles.formTextHeader}>{category.label}</Subheader>
          ) : (
            <Header
              title={category.label}
              operations={operations || [
                {id:'arrowLeft', icon:ArrowLeft, to:'/'},
                {id:'plus', icon:Plus, right: true, onClick: _ => this._openNewDialog()}
            ]}/>
          )
        }

        <div style={styles.searchBar(form)}>
          <Search
            size={20}
            color={"#999"}
            style={styles.searchBarIcon}
            onClick={ _ => this._focusSearchInput()}
          />
          <input
          style={styles.searchBarInput(form)}
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

        <List style={styles.list(form)}> 
          {
            showingItems.map(item =>
              <Link
                key={item.id}
                tabIndex={-1}
                className="list-link"
                to={`/${category.name.toLowerCase()}/${item.id}`}
              >
                
                <ListItem
                  primaryText={getInfo(settings.primaryFields, item)}
                  secondaryText={getInfo(settings.secondaryFields, item)}
                  leftAvatar={
                    <Avatar src={item.photo}/>
                  }
                  hoverColor="#E0F2F1"
                  rightIconButton={rightIconMenu}
                />
                <Divider inset={true}/>
                
              </Link>
            )
          }
        </List>

        <FullscreenDialog
          open={showNewDialog}
          onRequestClose={_ => this._newDialogClosed()}
          appBarStyle={{display: 'none'}}
        >
          <ItemNew
            title={`Nuevo ${category.itemLabel}`}
            closeDialog={_ => this.closeNewDialog()}
          />
        </FullscreenDialog>

      </div>
    );
  }
}

export default CategoryList;
