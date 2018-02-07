import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import CheckCircle from 'material-ui-icons/CheckCircle'
import Info from 'material-ui-icons/Info'
import Error from 'material-ui-icons/Error'

const styles = theme => ({
  messageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  messageIcon: {
    width: 20,
    height: 20,
    marginRight: theme.spacing.unit*2
  },
  messageText: {
    flex: 1,
    wordBreak: 'break-word'
  },
  contentSuccess: {
    background: theme.palette.success.dark
  },
  contentError: {
    background: theme.palette.error.main
  },
  contentInfo: {
    background: theme.palette.grey.dark
  }
})

class Notifier extends Component {
  state = {
    showNotification: false,
    moreThanOneNotification: false
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

  handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') return
    this.setState({showNotification: false})
  }

  getSnackbarClassName = notificationType => {
    const classes = this.props.classes
    if (notificationType === 'error') {
      return classes.contentError
    } else if (notificationType === 'success') {
      return classes.contentSuccess
    }
    return classes.contentInfo
  }

  getIcon = notificationType => {
    const { classes } = this.props
    if (notificationType === 'error') {
      return <Error className={classes.messageIcon}/>
    } else if (notificationType === 'success') {
      return <CheckCircle className={classes.messageIcon}/>
    }
    return <Info className={classes.messageIcon}/>
  }

  render = () => {
    const { notification, classes } = this.props
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={this.state.showNotification}
        onClose={this.handleNotificationClose}
        autoHideDuration={5000}
        transitionDuration={{
          enter: 200,
          exit: this.state.moreThanOneNotification ? 0 : 200
        }}
        SnackbarContentProps={{
          className: this.getSnackbarClassName(notification.type)
        }}
        message={
          <div className={classes.messageContainer}>
            {this.getIcon(notification.type)}
            <span className={classes.messageText}>{notification.message}</span>
          </div>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleNotificationClose}
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
