import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'

const Operation = props => {
  const { id, icon, color, hidden, to, description, onClick } = props
  const Icon = icon

  return (
    <div hidden={hidden}>
    {to ? (
      <Link to={to}>
        <IconButton color={color}>
          <Icon aria-label={id} onClick={onClick}/>
        </IconButton>
      </Link> 
    ) : (
      description ? (
        <Tooltip title={description} placement="bottom" enterDelay={200}>
          <IconButton color={color} style={{cursor: onClick ? 'pointer' : 'default'}}>
            <Icon aria-label={id} onClick={onClick}/>
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton color={color} style={{cursor: onClick ? 'pointer' : 'default'}}>
          <Icon aria-label={id} onClick={onClick}/>
        </IconButton>
      )
    )}
    </div>
  )
}

Operation.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  to: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
}

Operation.defaultProps = {
  hidden: false,
  color: "contrast",
}

export default Operation
