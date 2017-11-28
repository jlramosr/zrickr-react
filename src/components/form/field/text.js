import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

let CustomTextField = props => {
  const {
    id,
    type,
    required,
    description,
    order,
    value,
    label,
    handleFormFieldChange,
    classes
  } = props
  return (
    <TextField
      inputClassName={classes.input}
      labelClassName={classes.inputLabel}
      error={required && !value}
      multiline={type==='text'}
      rowsMax="10"
      rows="10"
      fullWidth 
      required={required}
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
  options: PropTypes.array,
  relation: PropTypes.string,
  value: PropTypes.any,
  order: PropTypes.number,
  handleFormFieldChange: PropTypes.func
}

export default CustomTextField
