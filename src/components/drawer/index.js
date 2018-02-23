import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { toggleDrawer, notify } from '../../actions/interactions'
import { settingAuthUser, setAuthUser } from '../../actions/app'
import { withStyles } from 'material-ui/styles'

import { MenuItem } from 'material-ui/Menu'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import Drawer from 'reactjspain-drawer'
import API from '../../utils/api'

const styles = {
  menuItem: {
    textTransform: 'capitalize'
  }
}

class CustomDrawer extends Component {

  onSignOut = event => {
    event.preventDefault()
    const { settingAuthUser, close} = this.props
    const authSource = process.env.REACT_APP_AUTH_SOURCE

    settingAuthUser()

    API(authSource).signOut()
      .then(() => {
        close()
        notify('You have succesfully logged out', 'error')
      })
      .catch(error => {
        notify(error, 'error')
      })
      .finally(() => {
        /*API(authSource).fetchAuthUser(authUser => {
          setAuthUser(authUser)
        })*/
      })
  }

  render = () => {
    const { categoriesPath, categories, open, close, classes } = this.props

    return (
      <Drawer open={open} sections={categories} />
    )
  }
}

CustomDrawer.propTypes = {
  categories: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ app, categories, interactions }) => ({
  categoriesPath: app.categoriesPath,
  categories: Object.values(categories.byId),
  open: interactions.drawerOpen
})

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(toggleDrawer(false)),
  settingAuthUser: () => dispatch(settingAuthUser()),
  setAuthUser: authUser => dispatch(setAuthUser(authUser))
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(CustomDrawer)
)
