import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'
import { addOpenDialog, removeOpenDialog } from '../../actions/dialogs'

const Transition = props => (<Slide direction="up" {...props} />)

class ControlledDialog extends Component {
  state = {
    open: false,
    level: 0
  }

  _handleRequestClose = () => {
    this.setState({open: false})
  }

  componentWillReceiveProps = nextProps => {
    const { openDialogs } = this.props
    if (this.props.open !== nextProps.open) {
      console.log(this.refs, this.props.children.ref)
      if (nextProps.open) {
        const currentDialog = document.getElementById('dialog')
        if (currentDialog) {
          currentDialog.open = false
        }
        this.setState({open: true, level:openDialogs.length+1})
        this.props.addOpenDialog(nextProps.children.props)
      }
      else {
        this.setState({
          open: false,
          level: 0
        })
        this.props.removeOpenDialog(this.props.children.props)
      }
    } 
  }

  render = () => {
    const {
      children,
      addOpenDialog,
      removeOpenDialog,
      openDialogs,
      dialogId,
      onRequestClose,
      classes,
      ...rest
    } = this.props

    return (
      <Dialog
        {...rest}
        ref={dialogId}
        maxWidth="lg"
        fullWidth
        transition={Transition}
        open={this.state.open}
        onRequestClose={() => {
          onRequestClose()
          this._handleRequestClose
        }}
      >
        {children}
      </Dialog>
    )
  }
}

ControlledDialog.propTypes = {
  children: PropTypes.node.isRequired,
  addOpenDialog: PropTypes.func.isRequired,
  removeOpenDialog: PropTypes.func.isRequired,
  openDialogs: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  openDialogs: state.dialogs.openDialogs
})

const mapDispatchToProps = dispatch => ({
  addOpenDialog: dialog => dispatch(addOpenDialog(dialog)),
  removeOpenDialog: dialog => dispatch(removeOpenDialog(dialog))
})

export default connect(mapStateToProps,mapDispatchToProps)(ControlledDialog)