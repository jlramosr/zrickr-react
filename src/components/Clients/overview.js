import React, { Component } from 'react';
import Header from '../Header';
import RaisedButton from 'material-ui/RaisedButton';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import Check from 'react-icons/lib/fa/check';
import Edit from 'react-icons/lib/md/edit';
import Trash from 'react-icons/lib/ti/trash';
import './new.css';

class ItemOverview extends Component {
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
    const { item, category } = this.props;

    return (

      
      <div className="itemoverview">



        <Header title={item ? item.name : ''} actions={[
          {id:'arrowLeft', icon:ArrowLeft, to:`/${category.name}`},
          {id:'check', icon:Check, right: true, onClick: _ => this._updateItem()},
          {id:'edit', icon:Edit, right: true, onClick: _ => this._changeEditMode(true)},
          {id:'trash', icon:Trash, right: true, onClick: _ => this._deleteItem()},
        ]}/>

        <RaisedButton label="Default" />

      </div>
      
    );
  }
}

export default ItemOverview;
