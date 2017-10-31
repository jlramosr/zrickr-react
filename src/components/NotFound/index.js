import React from 'react'
import PropTypes from 'prop-types'

const NotFound = props => {
  return (
    <div style={{padding: 40}}>{props.text || 'Page Not Found'}</div>
  )
}

NotFound.propTypes = {
  text: PropTypes.string
}

export default NotFound