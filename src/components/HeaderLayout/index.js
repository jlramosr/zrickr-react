import React from 'react'
import PropTypes from 'prop-types'
import CustomToolbar from './toolbar'
import { withStyles } from 'material-ui/styles'

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
    }
  }
})

const HeaderLayout = props => {
  const {
    relative,
    relativeHeight,
    overflow,
    contentToolbar,
    secondaryToolbar,
    operations,
    children,
    classes,
    theme,
    ...rest 
  } = props

  return (
    <div className={classes.root}>
      <div
        className={classes.toolbar}
        style={relative ?
          {position:'relative', zIndex: 0} :
          {position:'fixed', zIndex: theme.zIndex.appBar+1}}
      >
        <CustomToolbar
          secondary={secondaryToolbar}
          customContent={contentToolbar}
          operations={operations || []}
          {...rest}
        />
      </div>
      <div
        className={classes.content}
        style={{
          overflow : overflow || 'auto', 
          ...(
            relative ? {
              marginTop: 0,
              maxHeight: relativeHeight
            } : {}
          )
        }}
      >
        {children}
      </div>
    </div>
  )
}

HeaderLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  relative: PropTypes.bool,
  relativeHeight: PropTypes.number,
  operations: PropTypes.array,
  title: PropTypes.string,
  overflow: PropTypes.bool,
  updateSearchQuery: PropTypes.func,
  contentToolbar: PropTypes.node,
  loading: PropTypes.bool
}

HeaderLayout.defaultProps = {
  relative: false
}

export default withStyles(styles, {withTheme: true})(HeaderLayout)
