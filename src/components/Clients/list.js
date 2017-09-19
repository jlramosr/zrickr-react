import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../App/header';
import ReactList from 'react-list';
import Plus from 'react-icons/lib/fa/plus';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import { Modal } from 'react-overlays';
import ItemNew from './new';
import './index.css';

const createItemDialogStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  background: '#fff',
  outline: 'none'
}

class CategoryList extends Component {
  state = {
    showNewDialog: false
  }

  _openNewDialog() {
    this.setState({ showNewDialog: true});
  }

  closeNewDialog = this.closeNewDialog.bind(this);
  closeNewDialog() {
    this.setState({ showNewDialog: false});
  }

  _newDialogClosed() {
    this.setState({ showNewDialog: false})
  }

  componentDidMount() {
  }

  render() {
    const { showNewDialog } = this.state;
    const { items, category } = this.props;

    return (

      <div className="category">

        <Header title={category.label} actions={[
          {id:'arrowLeft', icon:ArrowLeft, to:'/'},
          {id:'plus', icon:Plus, right: true, onClick: _ => this._openNewDialog()}
        ]}/>

        <ReactList
          length={Object.keys(items).length}
          initialIndex={0}
          type="uniform"
          itemRenderer={ (index, key) =>
            <div key={key}>
              <Link to={`/${category.name}/${items[index].id}`}>
                {items[index].name}
              </Link>
            </div>
          }/>

        <Modal
          style={createItemDialogStyle}
          show={showNewDialog}
          onHide={this._newDialogClosed}>
          <ItemNew
            title={`Nuevo ${category.itemLabel}`}
            closeDialog={this.closeNewDialog}/>
        </Modal>

      </div>
    );
  }
}

export default CategoryList;
