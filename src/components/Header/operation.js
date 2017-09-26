import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';

const _operationStyle = {
  height: '100%'
}

class HeaderOperation extends Component {
  static propTypes = {
    operation: PropTypes.object.isRequired
  }

  render() {
    const { operation } = this.props;
    const Icon = operation.icon;
    const _size = operation.size || 20;
    const _color = operation.color || '#fff';

    return (

      <div style={_operationStyle} hidden={operation.hidden}>{
        operation.to ? (
          <Link to={operation.to}>
            <IconButton>
              <Icon size={_size} color={_color} onClick={operation.onClick}/>
            </IconButton>
          </Link> 
        ) : (
          <IconButton
            disableTouchRipple={!operation.onClick}
            style={{
              cursor: operation.onClick ? 'pointer' : 'default'
            }}>
            <Icon size={_size} color={_color} onClick={operation.onClick}/>
          </IconButton>
        )
      }</div>

    );
  }
}

export default HeaderOperation;
