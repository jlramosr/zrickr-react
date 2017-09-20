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
    tinyItems: [],
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
    this.setState({
      tinyItems: [
        {id:'11231', primaryInfo:'Amazon', secondaryInfo: 'Company'},
        {id:'24124', primaryInfo:'Google', secondaryInfo: 'Company'}
      ]
    })
  }

  render() {
    const { showNewDialog, tinyItems } = this.state;
    const { category } = this.props;

    console.log(tinyItems[0]);

    return (

      <div className="categorylist">

        <Header title={category.label} actions={[
          {id:'arrowLeft', icon:ArrowLeft, to:'/'},
          {id:'plus', icon:Plus, right: true, onClick: _ => this._openNewDialog()}
        ]}/>

        <ReactList
          length={tinyItems.length}
          initialIndex={0}
          type="uniform"
          itemRenderer={ (index, key) =>
            <div key={key}>
              <Link to={`/${category.name}/${tinyItems[index].id}`}>
                {tinyItems[index].primaryInfo}
              </Link>
            </div>
          }/>

        <FullscreenDialog
          open={showNewDialog}
          onRequestClose={_ => this._newDialogClosed()}
          appBarStyle={{display: 'none'}}>
          <ItemNew
            title={`Nuevo ${category.itemLabel}`}
            closeDialog={_ => this.closeNewDialog()}
          />
        </FullscreenDialog>

      </div>
    );
  }
}

export default CategoryList;
