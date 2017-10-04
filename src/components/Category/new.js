import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
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
      <div>

        <Header title={this.props.title} operations={[
          {id:'close', icon:Close, onClick: _ => closeDialog()},
          {id:'check', icon:Check, right: true, onClick: _ => this._createItem()}
        ]}/>
      
        


      </div>

    );
  }
}

CategoryItemNew.propTypes = {
  closeDialog: PropTypes.func.isRequired,
}

export default CategoryItemNew;
