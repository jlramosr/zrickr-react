import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'

const Action = props => {
  const { id, to, icon, color, onClick } = props
  const Icon = icon
  return (
    <IconButton style={{cursor: onClick || to ? 'pointer' : 'default', color}}>
      <Icon aria-label={id} onClick={onClick} />
    </IconButton>
  )
}

const Operation = props => {
  const { hidden, to, description } = props
  
  return (
    <div hidden={hidden}>
      {to ? (
        <Link to={to}>
          <Action {...props} />
        </Link> 
      ) : (
        description ? (
          <Tooltip
            title={description}
            placement="left"
            disableTriggerTouch
            disableTriggerFocus
            enterDelay={1000}
            leaveDelay={0}
          >
            <Action {...props} />
          </Tooltip>
        ) : (
          <Action {...props} />
        )
      )}
    </div>
  )
}

Operation.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  color: PropTypes.string,
  hidden: PropTypes.bool,
  to: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func
}

Operation.defaultProps = {
  hidden: false,
  color: 'contrast'
}

export default Operation
