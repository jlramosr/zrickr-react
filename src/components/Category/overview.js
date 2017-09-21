import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import Form from '../Form';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import Check from 'react-icons/lib/fa/check';
import Edit from 'react-icons/lib/md/edit';
import Trash from 'react-icons/lib/ti/trash';
import './new.css';

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

  componentDidMount() {
  }

  render() {
    const { category, item, fields } = this.props;
    const { editMode } = this.state;

    const _item = {...item};

    for (const field of fields) {
      console.log(fields);
      if (field.primaryInfo) {
        _item[field.name] = _item.primaryInfo;
      } else if (field.secondaryInfo) {
        _item[field.name] = _item.secondaryInfo;
      } 
    }

    return (
      <div className="itemoverview">

        <Header 
          title={item ? item.primaryInfo : ''}
          backgroundColor="#fff"
          textColor="#006064"
          operations={[
            {id:'arrowLeft', icon:ArrowLeft, color:"#006064", to:`/${category.name}`},
            {id:'check', icon:Check, right: true, hidden:!editMode, color:"#006064", onClick: _ => this._updateItem()},
            {id:'edit', icon:Edit, right: true, hidden:editMode, color:"#006064", onClick: _ => this._changeEditMode(true)},
            {id:'trash', icon:Trash, right: true, hidden:editMode, color:"#006064", onClick: _ => this._deleteItem()},
          ]}
        />

        <Form fields={fields} item={_item}/>

      </div>
    );
  }
}

export default ItemOverview;
