import React, { Component } from 'react';
import { BrowserHistory, Router, Route, Link } from 'react-router'
import PropTypes from 'prop-types';
import Header from '../Header';
import Form from '../Form';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import Check from 'react-icons/lib/fa/check';
import Edit from 'react-icons/lib/md/edit';
import Trash from 'react-icons/lib/ti/trash';
import { getInfo } from './helpers';

class ItemOverview extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired
  }

  state = {
    editMode: false
  }

  _updateItem() {
    console.log("UPDATE ITEM");
    this._changeEditMode(false);
  }

  _deleteItem() {
    console.log("DELETE ITEM");
    /*TODO:
      return to list
    */
  }

  _changeEditMode(editMode) {
    console.log("EDIT MODE", editMode);
    this.setState({editMode});
  }

  render() {
    const { category, settings, item, fields, prevPath } = this.props;
    const { editMode } = this.state;

    console.log(prevPath)

    return (
      <div>

        <Header 
          title={item ? getInfo(settings.primaryFields, item) : ''}
          backgroundColor={settings.color || '#fff'}
          textColor="#006064"
          operations={[
            {id:'arrowLeft', icon:ArrowLeft, color:"#006064", to: prevPath || `/${category.name}`},
            {id:'check', icon:Check, right: true, hidden:!editMode, color:"#006064", onClick: _ => this._updateItem()},
            {id:'edit', icon:Edit, right: true, hidden:editMode, color:"#006064", onClick: _ => this._changeEditMode(true)},
            {id:'trash', icon:Trash, right: true, hidden:editMode, color:"#006064", onClick: _ => this._deleteItem()},
          ]}
        />

        <Form
          cols={12}
          view="overview"
          fields={fields}
          values={item}
        />

      </div>
    );
  }
}

export default ItemOverview;
