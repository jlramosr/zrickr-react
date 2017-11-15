import React from 'react'
import PropTypes from 'prop-types'
import { FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'

let SwitchField = props => {
  const { id, value, label, handleFormFieldChange, classes } = props
  return (
    <FormControlLabel
      classes={{
        label: classes.inputSwitchLabel
      }}
      control={
        <Switch
          checked={Boolean(value)}
          onChange={(event, value) => handleFormFieldChange(id, value)}
        />
      }
      label={label}
    />
  )
}

SwitchField.propTypes = {
}

SwitchField.defaultProps = {
}

export default SwitchField
