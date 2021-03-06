import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

const getInputClassName = (classes, type, infoMode, readonly, required) => {
  let className = type === 'text' ? 'textarea' : 'inputText'
  if (infoMode) {
    className += 'Info'
  } else if (readonly) {
    className += 'Readonly'
  } else if (required) {
    className += 'Required'
  }
  return classes[className]
}

let CustomTextField = props => {
  const {
    id,
    type,
    required,
    readonly,
    infoMode,
    description,
    order,
    value,
    label,
    sendFormFieldChange,
    classes
  } = props
  const InputProps = {
    inputProps: {
      className: getInputClassName(classes, type, infoMode, readonly, required)
    },
    tabIndex: order,
    disableUnderline: true
  }
  const InputLabelProps = {
    shrink: true
  }

  return (
    <TextField
      error={required && !value}
      multiline={type==='text'}
      rowsMax="10"
      rows="10"
      fullWidth 
      required={!infoMode && required}
      disabled={readonly || infoMode}
      type={type === 'number' ? 'number' : 'text'}
      label={label}
      helperText={description}
      FormHelperTextProps={{className: classes.helperText}}
      value={value || ''}
      InputProps={InputProps}
      InputLabelProps={InputLabelProps}
      labelClassName={classes.labelText}
      onChange={event =>
        sendFormFieldChange(id, event.target.value)
      }
    />
  )
}

CustomTextField.propTypes = {
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

export default CustomTextField
