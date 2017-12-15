import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'
import ItemDetail from '../category/detail'
import { removeOpenDialog } from '../../actions/dialogs'

const Transition = props => (<Slide direction="up" {...props} />)

class ControlledDialog extends Component {
  state = {
    renderContent: true
  }

  _handleRequestClose = () => {
    console.log("HOLA")
    this.setState({isClosing: true, renderContent: false})
  }


  render = () => {
    const { openDialogs, removeOpenDialog, isChangingDialogs } = this.props

    const numActiveDialogs = openDialogs.length
    const currentDialogProps = numActiveDialogs ?
      openDialogs[numActiveDialogs-1] :
      {}

    console.log(currentDialogProps)
    //if (isChangingDialogs) return (<div>{"hola"}</div>)
    if (numActiveDialogs) return (
      <React.Fragment> 
        <Dialog
          open={numActiveDialogs % 2 === 0 || (numActiveDialogs % 2 === 1  && isChangingDialogs)}
          maxWidth="lg"
          fullWidth
          transition={Transition}
          onRequestClose={this._handleRequestClose}
        >
          <ItemDetail
            dialogMode
            closeDialog={() => {
              removeOpenDialog()
            }}
            {...currentDialogProps}
          />
          }
        </Dialog>
        <Dialog
          open={numActiveDialogs % 2 === 1 || (numActiveDialogs % 2 === 0  && isChangingDialogs)}
          maxWidth="lg"
          fullWidth
          transition={Transition}
          onRequestClose={this._handleRequestClose}
        >
          <ItemDetail
            dialogMode
            closeDialog={() => {
              removeOpenDialog()
            }}
            {...currentDialogProps}
          />
        }
        </Dialog>
      </React.Fragment>    
    )
    return <React.Fragment><div></div></React.Fragment>
  }
}

ControlledDialog.propTypes = {
  children: PropTypes.node.isRequired,
  openDialogs: PropTypes.array.isRequired
}

const mapStateToProps = ( {dialogs} ) => ({
  openDialogs: dialogs.openDialogs,
  isChangingDialogs: dialogs.isChanging
})

const mapDispatchToProps = (dispatch, props) => ({
  removeOpenDialog: () => dispatch(removeOpenDialog())
})

export default connect(mapStateToProps,mapDispatchToProps)(ControlledDialog)