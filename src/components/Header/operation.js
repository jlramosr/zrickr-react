import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';

const styles = theme => {

};

const HeaderOperation = props => {
  const { classes, id, icon, hidden, to, onClick } = props;
  const Icon = icon;

  console.log(classes, props);
  return (
    <div hidden={hidden}>
      {
        to ? (
          <Link to={to}>
            <IconButton>
              <Icon aria-label={id} onClick={onClick}/>
            </IconButton>
          </Link> 
        ) : (
          <IconButton
            style={{
              cursor: onClick ? 'pointer' : 'default'
            }}>
            <Icon aria-label={id} onClick={onClick}/>
          </IconButton>
        )
      }
    </div>
  );
};

HeaderOperation.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  right: PropTypes.bool.isRequired,
  to: PropTypes.bool,
  onClick: PropTypes.func,
};

HeaderOperation.defaultProps = {
  hidden: false,
};

export default withStyles(styles)(HeaderOperation);
