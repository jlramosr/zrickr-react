import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'
import { openDialog, closeDialog } from '../../actions/dialogs'

const Transition = props => (<Slide direction="up" {...props} />)

class ControlledDialog extends Component {
  render = () => {
    const {
      children,
      openDialog,
      closeDialog,
      openedDialogs,
      dialogId,
      open,
      ...rest
    } = this.props

    return (
      <Dialog
        {...rest}
        onEntered={openDialog}
        onExited={closeDialog}
        maxWidth="md"
        fullWidth
        transition={Transition}
        open={open && !openedDialogs.includes(dialogId)}
      >
        {children}
      </Dialog>
    )
  }
}

ControlledDialog.propTypes = {
  children: PropTypes.node.isRequired,
  openDialog: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  openedDialogs: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  const { categories, dialogs } = state
  return {
    categories: Object.values(categories.byId),
    openedDialogs: dialogs.openedDialogs
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  openDialog: () => dispatch(openDialog(props.dialogId)),
  closeDialog: () => dispatch(closeDialog(props.dialogId))
})

export default connect(mapStateToProps,mapDispatchToProps)(ControlledDialog)
