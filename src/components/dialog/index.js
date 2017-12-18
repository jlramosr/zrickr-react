import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'

const Transition = props => (<Slide direction="up" {...props} />)

class CustomDialog extends Component {
  render = () => {
    const {
      children,
      onRequestClose,
      classes,
      ...rest
    } = this.props

    return (
      <Dialog
        {...rest}
        maxWidth="lg"
        fullWidth
        transition={Transition}
        onRequestClose={() => {
          onRequestClose()
        }}
      >
        {children}
      </Dialog>
    )
  }
}

CustomDialog.propTypes = {
  children: PropTypes.node.isRequired
}

export default CustomDialog