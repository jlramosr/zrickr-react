import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

const HeaderOperation = props => {
  const { id, icon, hidden, to, description, onClick } = props;
  const Icon = icon;

  return (
    <div hidden={hidden}>
    {to ? (
      <Link to={to}>
        <IconButton color="contrast">
          <Icon aria-label={id} onClick={onClick}/>
        </IconButton>
      </Link> 
    ) : (
      description ? (
        <Tooltip title={description} placement="bottom" enterDelay={200}>
          <IconButton color="contrast" style={{cursor: onClick ? 'pointer' : 'default'}}>
            <Icon aria-label={id} onClick={onClick}/>
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton color="contrast" style={{cursor: onClick ? 'pointer' : 'default'}}>
          <Icon aria-label={id} onClick={onClick}/>
        </IconButton>
      )
    )}
    </div>
  );
};

HeaderOperation.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  to: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
};

HeaderOperation.defaultProps = {
  hidden: false,
};

export default HeaderOperation;
