import React from 'react'
import PropTypes from 'prop-types'
import { ListItemText, ListItemIcon } from 'material-ui/List'
import Menu, { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'

const styles = {
  menu: {
    border: '1px solid #ddd'
  },
  item: {
    padding: 4,
    paddingLeft: 12,
    paddingRight: 16
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8
  },
  labelContainer: {
    padding: 0
  },
  labelText: {
    fontSize: 14
  }
}

let CustomMenu = props => {
  const { operations, classes, ...restProps } = props

  return (
    <Menu
      elevation={4}
      transformOrigin={{ vertical: 'top', horizontal: 'right'}}
      classes={{paper: classes.menu}}
      {...restProps}
    >
      {operations.map(operation => {
        const { id, icon, label, onClick } = operation
        const Icon = icon
        return (
          <MenuItem
            key={id}
            className={classes.item}
            onClick={() => {
              onClick()
              props.onClose()
            }}
          >
            <ListItemIcon className={classes.icon}>
              <Icon />
            </ListItemIcon>
            <ListItemText classes={{ root: classes.labelContainer, primary: classes.labelText }} inset primary={label} />
          </MenuItem>
        )
      })}
    </Menu>
  )
}

CustomMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  anchorEl: PropTypes.object,
  operations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  }))
}

CustomMenu.defaultProps = {
  
}

export default withStyles(styles)(CustomMenu)