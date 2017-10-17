import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toolbar from '../HeaderLayout/toolbar';
import Close from 'material-ui-icons/Close';
import Check from 'material-ui-icons/Check';

class CategoryItemNew extends Component {

  _createItem = _ => {
    console.log("CREAR ITEM");
    this.props.closeDialog();
  }

  render = _ => {
    const { closeDialog, itemLabel } = this.props;

    return (
      <Toolbar
        title={`Nuevo ${itemLabel}`} 
        operations={[
          {id:'close', icon:Close, onClick:closeDialog},
          {id:'check', icon:Check, right: true, onClick:this._createItem}
        ]}
      /> 
    );
  }
}

CategoryItemNew.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  itemLabel: PropTypes.string,
}

export default CategoryItemNew;
