import React, { Component } from 'react';
import Header from '../Header';
import Close from 'material-ui-icons/Close';
import Check from 'material-ui-icons/Check';

const styles = {
  item: {
    outline: 'none'
  }
}

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
      <div style={styles.item}>

        <Header title={this.props.title} operations={[
          {id:'close', icon:Close, onClick: _ => closeDialog()},
          {id:'check', icon:Check, right: true, onClick: _ => this._createItem()}
        ]}/>
      
        


      </div>

    );
  }
}

export default ItemNew;