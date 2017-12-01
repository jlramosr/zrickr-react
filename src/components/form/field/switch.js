import React from 'react'
import PropTypes from 'prop-types'
import { FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'
import Tooltip from 'material-ui/Tooltip'

let SwitchField = props => {
  const { id, value, readonly, infoMode, label, handleFormFieldChange, classes } = props
  return (
    <FormControlLabel
      classes={{
        label: classes.labelSwitch
      }}
      control={
        <Tooltip
          disableTriggerFocus={!infoMode}
          disableTriggerHover={!infoMode}
          disableTriggerTouch={!infoMode}
          style={{cursor: 'default'}}
          title={value ? 'Yes' : 'No'}
        >
          <div>
            <Switch
              classes={{
                disabled: value ?
                  classes.inputSwitchTrue :
                  classes.inputSwitchFalse,
                default: value ?
                  classes.inputSwitchTrue :
                  classes.inputSwitchFalse
              }}
              disabled={readonly || infoMode}
              checked={Boolean(value)}
              onChange={(event, value) => handleFormFieldChange(id, value)}
            />
          </div>
        </Tooltip>
      }
      label={label}
    />
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
  handleFormFieldChange: PropTypes.func
}

export default SwitchField