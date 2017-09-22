import React, { Component } from 'react';
import Header from '../Header';
import { Link } from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Plus from 'react-icons/lib/fa/plus';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import Search from 'react-icons/lib/fa/search';
import FullscreenDialog from 'material-ui-fullscreen-dialog';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ItemNew from './new';
import escapeRegExp from "escape-string-regexp";
import removeDiacritics from "remove-diacritics";
import './list.css';

const menuItemStyle = {
  color: "#00838F",
  fontSize: "14px"
}

const listMenuItemStyle = {
  display: 'flex',
  flexDirection: 'row',
  padding: "8px",
}

const iconMenuStyle = {
  paddingRight: "8px"
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
    style={iconMenuStyle}
    listStyle={listMenuItemStyle}
    iconButtonElement={iconButtonElement}
  >
    <MenuItem style={menuItemStyle}>View</MenuItem>
    <MenuItem style={menuItemStyle}>Edit</MenuItem>
    <MenuItem style={menuItemStyle}>Delete</MenuItem>
  </IconMenu>
);


class CategoryList extends Component {
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

  componentDidMount() {
  }

  render() {
    const { showNewDialog, searchQuery } = this.state;
    const { category, items } = this.props;

    let showingItems;
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim());
      const match = new RegExp(escapeRegExp(cleanQuery), 'i');
      showingItems = items.filter(item => (
        match.test(removeDiacritics(item.primaryInfo))
      ))
    } else {
      showingItems = items;
    }

    return (
      <div>

        <Header title={category.label} operations={[
          {id:'arrowLeft', icon:ArrowLeft, to:'/'},
          {id:'plus', icon:Plus, right: true, onClick: _ => this._openNewDialog()}
        ]}/>

        <div className="search-bar">
          <Search
            size={20}
            color={"#999"}
            className="search-bar-icon"
            onClick={ _ => this._focusSearchInput()}
          />
          <input
            className="search-bar-input"
            ref={searchInput => this.searchInput = searchInput}
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={ event => this._updateSearchQuery(event.target.value) }/>
          <div className="search-bar-showing" hidden={
            !(searchQuery && showingItems.length !== 0 && showingItems.length !== items.length)
          }>
            {`Mostrando ${showingItems.length} resultados`}
          </div>
          <div className="search-bar-showing" hidden={
            !(searchQuery && showingItems.length === 0)
          }>
            No se han encontrado coincidencias
          </div>
        </div>

        <List> {
          showingItems.map(item =>
            <Link
              key={item.id}
              tabIndex={-1}
              className="list-link"
              to={`/${category.name}/${item.id}`}
            >
              
              <ListItem
                primaryText={item.primaryInfo}
                secondaryText={item.secondaryInfo}
                leftAvatar={
                  <Avatar src={item.photo}/>
                }
                hoverColor="#E0F2F1"
                rightIconButton={rightIconMenu}
              />
              <Divider inset={true}/>
              
            </Link>
          )
        }</List>

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
