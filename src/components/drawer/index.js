import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { toggleDrawer } from '../../actions/interactions'
import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import { MenuItem } from 'material-ui/Menu'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'

const styles = {
  menuItem: {
    textTransform: 'capitalize'
  }
}

class CustomDrawer extends Component {
  render = () => {
    const { categoriesPath, categories, open, close, classes } = this.props

    return (
      <Drawer open={open}>
        <React.Fragment>
          <IconButton onClick={close}>
            <ChevronLeftIcon />
          </IconButton>
        </React.Fragment>
        <Divider />
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/${categoriesPath}/${category.id}`}>
            <MenuItem className={classes.menuItem} onClick={close}>
              {category.label}
            </MenuItem>
          </Link>
        ))}
      </Drawer>
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
  close: () => dispatch(toggleDrawer(false))
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(CustomDrawer)
)
