import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Action from './action';
import { ClipLoader } from 'react-spinners';
import './index.css';

class Actions extends Component {

  render() {
    const { actions } = this.props;
    return (
      <div className="header-actions">
        {actions && actions.map(action => 
          <Action key={action.id} action={action}/>
        )}
      </div>
    )
  }
}

class Header extends Component {
  render() {
    const { actions, title, loading } = this.props;
    const _loading = loading || false;

    return (
      <AppBar
        title={
          <div className="header-title">
            <span className="header-title-text">{title}</span> 
              <ClipLoader size={40} className="header-title-loading" loading={true}/>
          </div>
        }
        style={{
          height: '64px',
          background: '#00838F'
        }}
        iconElementLeft={
          React.createElement(Actions, {
            actions: actions.filter(action => !action.right)})
        }
        iconElementRight={
          React.createElement(Actions, {
            actions: actions.filter(action => action.right)})
        }
      >


          
      </AppBar>
    );
  }
}

export default Header;
