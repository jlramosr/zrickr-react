import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import './action.css';

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

      <div className="action">{
        action.to ? (
          <Link to={action.to}>
            <IconButton>
              <Icon size={_size} color={_color} onClick={action.onClick}/>
            </IconButton>
          </Link> 
        ) : (
          <IconButton
            disableTouchRipple={!action.onClick}
            style={{
              cursor: action.onClick ? 'pointer' : 'default'
            }}>
            <Icon size={_size} color={_color} onClick={action.onClick}/>
          </IconButton>
        )
      }</div>

    );
  }
}

export default HeaderAction;
