import React from 'react'
import PropTypes from 'prop-types'
import { FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import Tooltip from 'material-ui/Tooltip'

let SwitchField = props => {
  const { id, value, readonly, infoMode, label, sendFormFieldChange, classes } = props
  return (
    <FormControlLabel
      classes={{
        label: classes.labelSwitch
      }}
      control={
        <Tooltip
          ref={e1 => this.e = e1}
          disableTriggerFocus={!infoMode}
          disableTriggerHover={!infoMode}
          disableTriggerTouch={!infoMode}
          style={{cursor: 'default'}}
          title={value ? 'Yes' : 'No'}
        >
          <div>
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
  sendFormFieldChange: PropTypes.func
}

export default SwitchField