import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'

const Transition = props => (<Slide direction="up" {...props} />)

class LargeDialog extends Component {
  render = () => {
    const {
      windowSize,
      children,
      fullScreen,
      dispatch,
      classes,
      ...rest
    } = this.props

    return (
      <Dialog
        maxWidth="md"
        fullScreen={fullScreen || windowSize === 'xs' || windowSize === 'sm'}
        fullWidth
        transition={Transition}
        {...rest}
      >
        {children}
      </Dialog>
    )
  }
}

LargeDialog.propTypes = {
  children: PropTypes.node.isRequired
}

const mapStateToProps = ({ interactions }) => ({
  windowSize: interactions.windowSize
})

export default connect(mapStateToProps)(LargeDialog)