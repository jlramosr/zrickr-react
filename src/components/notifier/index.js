import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

const styles = theme => ({
  snackbar: {
    top: theme.spacing.unit,
    right: theme.spacing.unit,
    left: 'auto'
  },
  snackbarContentSuccess: {
    background: theme.palette.success[900]
  },
  snackbarContentError: {
    background: theme.palette.error[900]
  },
  snackbarContentInfo: {
    background: theme.palette.grey[900]
  }
})

class Notifier extends Component {
  state = {
    showNotification: false,
    moreThanOneNotification: false
  }

  _handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') return
    this.setState({showNotification: false})
  }

  _getSnackbarClassName = notificationType => {
    const classes = this.props.classes
    if (notificationType === 'error') {
      return classes.snackbarContentError
    } else if (notificationType === 'success') {
      return classes.snackbarContentSuccess
    }
    return classes.snackbarContentInfo
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.notification !== this.props.notification) {
      if (this.state.showNotification) {
        this.setState({showNotification: false, moreThanOneNotification: true})
        window.setTimeout(() => {
          this.setState({showNotification: true, moreThanOneNotification: false})
        }, 200)
      } else { 
        this.setState({showNotification: true})
      }
    }
  }

  render = () => {
    const { notification, classes } = this.props
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={this.state.showNotification}
        onClose={this._handleNotificationClose}
        className={classes.snackbar}
        autoHideDuration={3000}
        transitionDuration={{
          enter: 200,
          exit: this.state.moreThanOneNotification ? 0 : 200
        }}
        SnackbarContentProps={{
          className: this._getSnackbarClassName(notification.type)
        }}
        message={<span>{notification.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this._handleNotificationClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    )
  }
}

Notifier.propTypes = {
  notification: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ interactions }) => ({
  notification: interactions.notifications
})

export default connect(mapStateToProps, null)(withStyles(styles)(Notifier))
