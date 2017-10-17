import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from '../../utils/api';
import Toolbar from '../HeaderLayout/toolbar';
import Content from '../HeaderLayout/content';
import Form from '../Form';
import ArrowBack from 'material-ui-icons/ArrowBack';
import Close from 'material-ui-icons/Close';
import Check from 'material-ui-icons/Check';
import Edit from 'material-ui-icons/Edit';
import Delete from 'material-ui-icons/Delete';
import { getInfo } from '../../utils/helpers';

class CategoryItemOverview extends Component {
  state = {
    item: {},
    editMode: false,
    loading: true,
  }

  _updateItem = _ => {
    console.log("UPDATE ITEM", this.state.item);
    this._changeEditMode(false);
  }

  _deleteItem = _ => {
    console.log("DELETE ITEM", this.state.item);
    /*TODO:
      return to list
    */
  }

  _changeEditMode = editMode => {
    console.log("EDIT MODE", editMode);
    this.setState({editMode});
  }

  _getData = _ => {
    const { id, categoryId } = this.props;
    API('local').getDocument('categories_items', categoryId, id).then(item => {
      this.setState({item, loading: false});
    })
    .catch(error => {
      console.log("ERROR PIDIENDO ITEM OVERVIEW", error);
    })
  }

  componentDidMount = _ => {
    this._getData();
  }

  render = _ => {
    const { categoryId, settings, fields, closeDialog } = this.props;
    const { item, editMode, loading } = this.state;
    return (
      <div>
        <Toolbar 
          title={item ? getInfo(settings.primaryFields, item) : ''}
          loading={loading}
          operations={[
            {id:'arrowBack', icon:ArrowBack, hidden:Boolean(closeDialog), color:"#006064", to:`/${categoryId}`},
            {id:'close', icon:Close, hidden:!Boolean(closeDialog), color:"#006064", onClick:closeDialog},
            {id:'check', icon:Check, right: true, hidden:!editMode, color:"#006064", onClick:this._updateItem},
            {id:'edit', icon:Edit, right: true, hidden:editMode, color:"#006064", onClick: _ => this._changeEditMode(true)},
            {id:'delete', icon:Delete, right: true, hidden:editMode, color:"#006064", onClick:this._deleteItem},
          ]}
        />
        <Content>
          <Form
            cols={12}
            view="overview"
            fields={fields}
            values={item}
          />
        </Content>
      </div>
    );
  }
}

CategoryItemOverview.propTypes = {
  id: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  closeDialog: PropTypes.func,
}

CategoryItemOverview.defaultProps = {

}

export default CategoryItemOverview;
