import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { getInfo } from '../../../utils/helpers'

const CustomSelect = props => {
  const {
    id,
    label,
    handleFormFieldChange,
    classes
  } = props


  return (
    <div>
      <span className={classes.inputLabel}>{label}</span>
      <Select
        className={classes.selectInput}
        onChange={option => handleFormFieldChange(id, option)}
        {...props}
      />
    </div>
  )
  /*(
    




    <TextField
      InputClassName={classes.input}
      labelClassName={classes.inputLabel}
      error={required && !value}
      key={id}
      name={id}
      select
      fullWidth
      label={label}
      helperText={description}
      FormHelperTextProps={{className: classes.helperText}}
      value={value || ''}
      SelectProps={{native: true}}
      InputProps={{disableUnderline: true}}
      InputLabelProps={{shrink: true}}
      onChange={ event => 
        this.props.handleFormFieldChange(id, event.target.value)
      }
    >
      {relation ? (
        items.map(item => (
          <option key={item.id} value={item.id}>
            {getInfo(settings.primaryFields, item)}
          </option>
        ))
      ) : (
        options.map(item => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))
      )}
    </TextField>
  )*/
}

CustomSelect.propTypes = {
}

CustomSelect.defaultProps = {
}

const mapStateToProps = ({ settings, items }, props) => {
  if (props.relation) {
    return {
      settings: settings.byId[props.relationSettingsId],
      isFetchingSettings: settings.flow.isFetching,
      items: Object.values(items.byId).filter(item => props.relationItemsIds.includes(item.id)),
      isFetchingItems: items.flow.isFetching
    }
  }
  return {}
}

export default connect(mapStateToProps)(CustomSelect)
