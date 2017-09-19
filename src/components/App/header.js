import React, { Component } from 'react';
import HeaderAction from './headerAction';
import { ClipLoader } from 'react-spinners';
import './header.css';

class Header extends Component {
  componentDidMount() {
  }

  render() {
    const { actions, title, loading } = this.props;
    const _loading = loading || false;

    return (

      <div className="header">
        <div className="header-loading">
          <ClipLoader size={50} color={'#fff'} loading={_loading}/>
        </div>
        <div className="header-content">
          <div className="header-actions">
            {actions && actions
              .filter(action => !action.right)
              .map(action => <HeaderAction key={action.id} action={action}/>
            )}
          </div>
          <h1 className="header-title">{title}</h1>
          <div className="header-actions">
            {actions && actions
              .filter(action => action.right)
              .map(action => <HeaderAction key={action.id} action={action}/>
            )}
          </div>
        </div>
      </div>

    );
  }
}

export default Header;
