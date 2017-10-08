import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderLayout from '../HeaderLayout';
import Close from 'material-ui-icons/Close';
import Check from 'material-ui-icons/Check';

class CategoryItemNew extends Component {

  _createItem = _ => {
    console.log("CREAR ITEM");
    this.props.closeDialog();
  }

  render = _ => {
    const { closeDialog } = this.props;

    return (
      <HeaderLayout
        title={this.props.title} 
        operations={[
          {id:'close', icon:Close, onClick: _ => closeDialog()},
          {id:'check', icon:Check, right: true, onClick: _ => this._createItem()}
        ]}
      >
    
      </HeaderLayout>
    );
  }
}

CategoryItemNew.propTypes = {
  closeDialog: PropTypes.func.isRequired,
}

export default CategoryItemNew;
