import React, { Component } from 'react';
import Header from '../Header';
import Close from 'react-icons/lib/fa/close';
import Check from 'react-icons/lib/fa/check';
import './new.css';

class ItemNew extends Component {
  state = {
  }

  _createItem() {
    console.log("CREAR ITEM");
    this.props.closeDialog();
  }

  render() {
    const { closeDialog } = this.props;

    return (
      <div className="itemnew">

        <Header title={this.props.title} actions={[
          {id:'close', icon:Close, onClick: _ => closeDialog()},
          {id:'check', icon:Check, right: true, onClick: _ => this._createItem()}
        ]}/>
      
        

        

      </div>

    );
  }
}

export default ItemNew;
