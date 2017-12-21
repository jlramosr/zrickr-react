import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'

const Transition = props => (<Slide direction="up" {...props} />)

class CustomDialog extends Component {
  render = () => {
    const {
      children,
      classes,
      ...rest
    } = this.props

    return (
      <Dialog
        maxWidth="md"
        fullWidth
        transition={Transition}
        {...rest}
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