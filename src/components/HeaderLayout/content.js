import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  content: {
    paddingTop: theme.standards.toolbarHeights.mobilePortrait,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      paddingTop: theme.standards.toolbarHeights.mobileLandscape,
    },
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.standards.toolbarHeights.tabletDesktop,
    },
  },
});

let HeaderLayoutContent = props => {
  const { classes, children } = props;

  return (
    <div className={classes.content}>
      {children}
    </div>
  )
};

HeaderLayoutContent.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(HeaderLayoutContent);
