import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogContentText } from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'

const Transition = props => (<Slide direction="up" {...props} />)

class ConfirmationDialog extends Component {

  handleClose = (answer='cancel') => {
    const { onClose, onAccept, onCancel } = this.props
    if (answer === 'accept' && onAccept) {
      onAccept()
    } else if (answer === 'accept' && onCancel) {
      onCancel()
    }
    onClose()
  }

  render = () => {
    const {
      open,
      message,
      ...rest
    } = this.props

    return (
      <Dialog
        open={open}
        onClose={this.handleDialog}
        transition={Transition}
        {...rest}
      >
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            No
          </Button>
          <Button onClick={() => this.handleClose('accept')} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

ConfirmationDialog.propTypes = {
  message: PropTypes.string.isRequired
}

const mapStateToProps = ({ interactions }, props) => {
  /*const { open, message } = interactions.confirmationDialog
  return { open, message }*/
  return {}
}

const mapDispatchToProps = (dispatch, props) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialog)