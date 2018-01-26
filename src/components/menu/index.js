import React from 'react'
import PropTypes from 'prop-types'
import { ListItemText, ListItemIcon } from 'material-ui/List'
import Menu, { MenuItem } from 'material-ui/Menu'
import Divider from 'material-ui/Divider'
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
  },
  divider: {
    margin: 2
  }
}

//https://kamranicus.com/posts/2017-09-02-dynamic-import-material-icons-react
const StringIconToMaterialIcon = icon => {
  const capitalize = str => str.length
    ? str[0].toUpperCase() +
      str.slice(1).toLowerCase()
    : ''

  const titleCase = str => str
    .split(/\s+/)
    .map(capitalize)
    .join('')

  const iconName = titleCase(icon)
  let resolved = null
  try {
    resolved = require(`material-ui-icons/${iconName}`).default
  } catch (e) {
    //throw Error(`Could not find material-ui-icons/${capitalizeIcon}`)
    console.error(e)
    return null
  }
  return React.createElement(resolved)
}

const renderIcon = icon => {
  if (!icon) {
    return null
  }
  if (typeof icon !== 'string') {
    const Icon = icon
    return <Icon />
  }
  return StringIconToMaterialIcon(icon)
}

let CustomMenu = props => {
  const { operations, vertical, horizontal, classes, ...restProps } = props

  return (
    <Menu
      elevation={4}
      transformOrigin={{ 
        vertical: vertical === 'bottom' ? 'top' : 'bottom', 
        horizontal: vertical === 'left' ? 'right' : 'left'}
      }
      classes={{paper: classes.menu}}
      {...restProps}
    >
      {operations.map((operation, index) => {
        const { id, icon, label, onClick } = operation
        const iconRendered = renderIcon(icon)
        if (id.startsWith('divider')) {
          if (index !== operations.length-1) {
            return <Divider key={id} className={classes.divider}/>
          }
          return <React.Fragment key={id} />
        }
        return (
          <MenuItem
            key={id}
            className={classes.item}
            onClick={() => {
              onClick()
              props.onClose()
            }}
          >
            {iconRendered &&
              <ListItemIcon className={classes.icon}>
                {iconRendered}
              </ListItemIcon>
            }
            <ListItemText classes={{ root: classes.labelContainer, primary: classes.labelText }} primary={label} />
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
  vertical: PropTypes.string,
  horizontal: PropTypes.string,
  operations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.func,PropTypes.string]),
    onClick: PropTypes.func
  }))
}

CustomMenu.defaultProps = {
  vertical: 'bottom',
  horizontal: 'left'
}

export default withStyles(styles)(CustomMenu)