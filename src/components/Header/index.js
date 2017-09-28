import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Operation from './operation';
import PropTypes from 'prop-types';
import './index.css';

const styles = {
  header: (height, backgroundColor) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    height: `${height}px`,
    padding: '0 28px',
    background: backgroundColor,
  }),
  
  title: textColor => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    color: textColor,
  }),

  titleText: {
    margin: '0 14px 0 2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  titleLoading: loading => ({
    display: loading ? 'block' : 'none',
  }),

  operations: {
    display: 'flex',
  }
}

class Operations extends Component {

  render() {
    const { operations } = this.props;
    return (
      <div style={styles.operations}>
        {operations && operations.map(operation => 
          <Operation key={operation.id} operation={operation}/>
        )}
      </div>
    )
  }
}

class Header extends Component {
  static propTypes = {
    operations: PropTypes.array,
    title: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    height: PropTypes.number,
    loading: PropTypes.bool
  }

  static defaultProps = {
    height: 64,
    backgroundColor: '#00838F',
    textColor: '#fff',
    loading: true
  }

  render() {
    const { operations, title, backgroundColor, textColor, height, loading } = this.props;
    const _loading = loading || false;

    return (
      <AppBar
        className="header"
        title={
          <div style={styles.title(textColor)}>
            <span style={styles.titleText}>{title}</span> 
            <CircularProgress
              color={textColor}
              style={styles.titleLoading(_loading)}
            />
          </div>
        }
        style={styles.header(height, backgroundColor)}
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
