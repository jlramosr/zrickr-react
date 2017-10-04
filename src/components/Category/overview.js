import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import Form from '../Form';
import ArrowBack from 'material-ui-icons/ArrowBack';
import Check from 'material-ui-icons/Check';
import Edit from 'material-ui-icons/Edit';
import Delete from 'material-ui-icons/Delete';
import { getInfo } from '../../utils/helpers';

class CategoryItemOverview extends Component {
  state = {
    editMode: false
  }

  _updateItem = _ => {
    console.log("UPDATE ITEM");
    this._changeEditMode(false);
  }

  _deleteItem = _ => {
    console.log("DELETE ITEM");
    /*TODO:
      return to list
    */
  }

  _changeEditMode = editMode => {
    console.log("EDIT MODE", editMode);
    this.setState({editMode});
  }

  render = _ => {
    const { category, settings, item, fields } = this.props;
    const { editMode } = this.state;

    return (
      <div>

        <Header 
          title={item ? getInfo(settings.primaryFields, item) : ''}
          operations={[
            {id:'arrowBack', icon:ArrowBack, color:"#006064", to:`/${category.name}`},
            {id:'check', icon:Check, right: true, hidden:!editMode, color:"#006064", onClick: _ => this._updateItem()},
            {id:'edit', icon:Edit, right: true, hidden:editMode, color:"#006064", onClick: _ => this._changeEditMode(true)},
            {id:'delete', icon:Delete, right: true, hidden:editMode, color:"#006064", onClick: _ => this._deleteItem()},
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

CategoryItemOverview.propTypes = {
  item: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired
}

export default CategoryItemOverview;
