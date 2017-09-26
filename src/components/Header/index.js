import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Operation from './operation';
import { ClipLoader } from 'react-spinners';
import './index.css';

const styles = {
  header: backgroundColor => ({
    position: 'fixed',
    top: 0,
    left: 0,
    height: '64px',
    padding: '0 28px',
    background: backgroundColor || '#00838F'
  }),
  
  title: textColor => ({
    color: textColor || '#fff'
  })
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
        className="header"
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
        style={styles.header(backgroundColor)}
        titleStyle={styles.title(textColor)}
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
