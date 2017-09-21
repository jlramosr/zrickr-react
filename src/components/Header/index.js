import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Operation from './operation';
import { ClipLoader } from 'react-spinners';
import './index.css';

const headerStyle = {
  height: "64px",
  padding: "0 28px"
}

class Operations extends Component {

  render() {
    const { operations } = this.props;
    return (
      <div className="header-operations">
        {operations && operations.map(operation => 
          <Operation key={operation.id} operation={operation}/>
        )}
      </div>
    )
  }
}

class Header extends Component {
  render() {
    const { operations, title, backgroundColor, textColor, loading } = this.props;
    const _loading = loading || false;

    return (
      <AppBar
        title={
          <div className="header-title">
            <span className="header-title-text">{title}</span> 
            <ClipLoader
              size={40}
              color={textColor || '#fff'}
              className="header-title-loading" loading={true}
            />
          </div>
        }
        style={{...headerStyle,
          background: backgroundColor || "#00838F"
        }}
        titleStyle={{
          color: textColor || '#fff'
        }}
        iconElementLeft={
          React.createElement(Operations, {
            operations: operations.filter(operation => !operation.right)})
        }
        iconElementRight={
          React.createElement(Operations, {
            operations: operations.filter(operation => operation.right)})
        }
      >


          
      </AppBar>
    );
  }
}

export default Header;
