import React from 'react'
import PropTypes from 'prop-types'
import CustomToolbar from './toolbar'
import { withStyles } from 'material-ui/styles'

const secondaryToolbarProperties = {
  height: 42,
  color: 'primary',
  tone: 200,
  fontColor: 'primary',
  fontTone: 800
}

const styles = theme => ({
  root: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
    margin: 0,
    padding: 0
  },
  toolbar: {
    overflow: 'hidden',
    width: '100%',
    flex: '0 0 auto',
    paddingRight: 0
  },
  content: {
    flex: '1 1 auto',
    overflowY: 'auto',
    width: '100%',
    height: `calc(100vh - ${theme.standards.toolbarHeights.mobilePortrait}px)`,
    marginTop: theme.standards.toolbarHeights.mobilePortrait,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      marginTop: theme.standards.toolbarHeights.mobileLandscape,
      height: `calc(100vh - ${theme.standards.toolbarHeights.mobileLandscape}px)`
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.standards.toolbarHeights.tabletDesktop,
      height: `calc(100vh - ${theme.standards.toolbarHeights.tabletDesktop}px)`
    },
    transition: theme.transitions.create('margin-top', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    })
  }
})

const HeaderLayout = props => {
  const {
    hidden,
    relative,
    relativeHeight,
    overflow,
    contentToolbar,
    secondaryToolbar,
    secondaryToolbarHeight,
    operations,
    children,
    classes,
    theme,
    ...rest 
  } = props

  let toolbarComputedStyle = {
    display: 'block',
    position:'fixed',
    zIndex: theme.zIndex.appBar+1
  }
  const secondaryToolbarProps = {
    ...secondaryToolbarProperties,
    height: secondaryToolbarHeight || secondaryToolbarProperties.height
  }
  let contentComputedStyle = {overflow : overflow || 'auto'}
  if (relative) {
    toolbarComputedStyle = {
      ...toolbarComputedStyle,
      position:'relative',
      zIndex: 0
    }
    contentComputedStyle = {
      ...contentComputedStyle,
      marginTop: 0,
      maxHeight: relativeHeight
    }
  }
  if (secondaryToolbar && !hidden) {
    contentComputedStyle = {
      height: `calc(100vh - ${secondaryToolbarProps.height}px)`,
      marginTop: secondaryToolbarProps.height,
      ...contentComputedStyle
    }
  }
  if (hidden) {
    toolbarComputedStyle = {
      display: 'none'
    }
    contentComputedStyle = {
      marginTop: 0,
      ...contentComputedStyle,
      height: '100vh'
    }
  }
  if (!children) {
    contentComputedStyle = {
      ...contentComputedStyle,
      height: 0
    }
  }

  return (
    <div className={classes.root}>

      <div className={classes.toolbar} style={toolbarComputedStyle}>
        <CustomToolbar
          secondary={secondaryToolbar}
          secondaryProps={secondaryToolbarProps}
          customContent={contentToolbar}
          operations={operations || []}
          {...rest}
        />
      </div>
      
      <div className={classes.content} style={contentComputedStyle}>
        {children}
      </div>

    </div>
  )
}

HeaderLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  hidden: PropTypes.bool,
  relative: PropTypes.bool,
  relativeHeight: PropTypes.number,
  operations: PropTypes.array,
  title: PropTypes.string,
  overflow: PropTypes.string,
  updateSearchQuery: PropTypes.func,
  contentToolbar: PropTypes.node,
  loading: PropTypes.bool
}

HeaderLayout.defaultProps = {
  relative: false
}

export default withStyles(styles, {withTheme: true})(HeaderLayout)
