import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

const _getInputClassName = (classes, infoMode, readonly, required) => {
  let className = 'inputText'
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
    handleFormFieldChange,
    classes
  } = props
  return (
    <TextField
      inputClassName={_getInputClassName(classes, infoMode, readonly, required)}
      labelClassName={classes.labelText}
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
      InputProps={{
        className: type==='text' ? classes.textarea: {},
        tabIndex: order,
        disableUnderline: true
      }}
      InputLabelProps={{shrink: true}}
      onChange={event =>
        handleFormFieldChange(id, event.target.value)
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
  handleFormFieldChange: PropTypes.func
}

export default CustomTextField
