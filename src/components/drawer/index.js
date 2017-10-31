import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { toggleDrawer } from '../../actions/drawer'
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
  render = _ => {
    const { categories, opened, close, classes } = this.props

    return (
      <Drawer open={opened}>
        <div>
          <IconButton onClick={close}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/${category.id}`}>
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
  opened: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  const { categories, drawer } = state;
  return {
    categories: categories.items,
    opened: drawer.opened
  }
}

const mapDispatchToProps = dispatch => ({
  close: _ => dispatch(toggleDrawer(false)),
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(CustomDrawer)
)
