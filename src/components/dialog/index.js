import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import Slide from 'material-ui/transitions/Slide'
import { addOpenDialog, removeOpenDialog } from '../../actions/dialogs'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  dialogTitle: {
    color: theme.palette.primary[800],
    fontSize: 20
  },
  dialogText: {
    color: theme.palette.secondary[800]
  }
})

const Transition = props => (<Slide direction="up" {...props} />)

const numMaxopenDialogs = 3

class ControlledDialog extends Component {
  state = {
    open: false,
    level: 0,
    showTooMuchDialogs: false,
    showAlreadyOpenDialog: false
  }

  _handleRequestClose = () => {
    this.setState({
      open: false,
      showTooMuchDialogs: false,
      showAlreadyOpenDialog: false
    })
  }

  componentWillReceiveProps = nextProps => {
    const { openDialogs } = this.props
    if (this.props.open !== nextProps.open) {
      if (nextProps.open) {
        if (openDialogs.includes(nextProps.dialogId)) {
          this.setState({showAlreadyOpenDialog: true})
        }
        else if (openDialogs.length >= numMaxopenDialogs) {
          this.setState({showTooMuchDialogs: true})
        } else {
          this.setState({open: true, level:openDialogs.length})
          this.props.addOpenDialog(nextProps.dialogId)
        }
      }
      else {
        this.setState({
          showAlreadyOpenDialog: false,
          showTooMuchDialogs: false,
          open: false,
          level: 0
        })
        this.props.removeOpenDialog(this.props.dialogId)
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

    const margin = this.state.level*40

    const dialogStyle = {
      width: `calc(100% - ${margin}px)`,
      height: `calc(100% - ${margin}px)`,
      top: margin/2,
      left: margin/2
    }

    return (
      <React.Fragment>
        <Dialog
          {...rest}
          maxWidth="lg"
          style={dialogStyle}
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

        <Dialog
          maxWidth="xs"
          transition={Transition}
          open={this.state.showTooMuchDialogs}
          onRequestClose={this._handleRequestClose}
        >
          <DialogTitle disableTypography className={classes.dialogTitle}>{'Too much open dialogs'}</DialogTitle>
          <DialogContent>
            <DialogContentText className={classes.dialogText}>
              You have opened a lot of dialogs. Please, close any of them if you want to continue opening more.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this._handleRequestClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          maxWidth="xs"
          transition={Transition}
          open={this.state.showAlreadyOpenDialog}
          onRequestClose={this._handleRequestClose}
        >
          <DialogTitle disableTypography className={classes.dialogTitle}>{'Dialog already open'}</DialogTitle>
          <DialogContent>
            <DialogContentText className={classes.dialogText}>
              You have opened this same dialog before. Please, close it before continuing.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this._handleRequestClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
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
  addOpenDialog: dialogId => dispatch(addOpenDialog(dialogId)),
  removeOpenDialog: dialogId => dispatch(removeOpenDialog(dialogId))
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(ControlledDialog)
)