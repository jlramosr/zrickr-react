import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'

let SwitchField = props => {
  const { id, value, readonly, infoMode, label, sendFormFieldChange, classes } = props
  return (
    <FormGroup>
      <FormControlLabel
        classes={{
          label: classes.labelSwitch
        }}
        control={
          <Checkbox
            classes={{
              disabled: value ?
                classes.inputSwitchDisabled :
                classes.inputSwitchDisabled,
              default: value ?
                classes.inputSwitchTrue :
                classes.inputSwitchFalse
            }}
            disabled={readonly || infoMode}
            checked={Boolean(value)}
            onChange={(event, value) => sendFormFieldChange(id, value)}
          />
        }
        label={label}
      />
    </FormGroup>
  )
}

SwitchField.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
  infoMode: PropTypes.bool,
  options: PropTypes.array,
  relation: PropTypes.string,
  value: PropTypes.any,
  order: PropTypes.number,
  sendFormFieldChange: PropTypes.func
}

export default SwitchField