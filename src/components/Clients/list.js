import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import ReactList from 'react-list';
import Plus from 'react-icons/lib/fa/plus';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import FullscreenDialog from 'material-ui-fullscreen-dialog';
import ItemNew from './new';
import './index.css';

class CategoryList extends Component {
  state = {
    showNewDialog: false
  }

  _openNewDialog() {
    this.setState({ showNewDialog: true});
  }

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

      <div className="categorylist">

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

        <FullscreenDialog
          open={showNewDialog}
          onRequestClose={_ => this._newDialogClosed()}
          appBarStyle={{display: 'none'}}>
          <ItemNew
            title={`Nuevo ${category.itemLabel}`}
            closeDialog={_ => this.closeNewDialog()}/>
        </FullscreenDialog>

      </div>
    );
  }
}

export default CategoryList;
