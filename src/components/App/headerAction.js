import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './headerAction.css';

class HeaderAction extends Component {
  static propTypes = {
    action: PropTypes.object.isRequired
  }

  render() {
    const { action } = this.props;
    const Icon = action.icon;
    const _size = action.size || 20;
    const _color = action.color || '#fff';

    return (

      <div className="action-content">{
        action.to ? (
          <Link to={action.to}>
            <Icon 
              size={_size}
              color={_color} 
              onClick={action.onClick}/>
          </Link> 
        ) : (
          <Icon
            size={_size}
            color={_color}
            style={{
                cursor: action.onClick ? 'pointer' : 'none'
            }}
            onClick={action.onClick}/>
        )
      }</div>

    );
  }
}

export default HeaderAction;
