import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogContentText } from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'

const Transition = props => (<Slide direction="up" {...props} />)

class ConfirmationDialog extends Component {

  handleClose = answer => {
    const { onClose, onAccept, onCancel } = this.props
    if (answer === 'accept' && onAccept) {
      onAccept()
    } else if (answer === 'cancel' && onCancel) {
      onCancel()
    }
    if (onClose) {
      onClose()
    }
  }

  render = () => {
    const { open, message } = this.props

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        transition={Transition}
      >
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose('cancel')} color="primary">
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

export default ConfirmationDialog