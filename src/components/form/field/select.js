import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchSettingsIfNeeded } from '../../../actions/settings'
import { fetchFieldsIfNeeded } from '../../../actions/fields'
import { fetchItemsIfNeeded } from '../../../actions/items'
import { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { FormControl, FormLabel } from 'material-ui/Form'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import { getItemString } from '../../category/utils/helpers'
import { isObject } from '../../../utils/helpers'

const getInputClassName = (classes, infoMode, readonly, required) => {
  let className = 'inputSelect'
  if (infoMode) {
    className += 'Info'
  } else if (readonly) {
    className += 'Readonly'
  } else if (required) {
    className += 'Required'
  }
  return classes[className]
}

const OptionRenderer = ({ option, selectValue, style }) => (
  <div key={option.id} onClick={() => selectValue(option)} style={style}>
    <ListItem
      button
      dense
      style={{
        overflow: 'hidden',
        display: 'flex'
      }}
    >
      <ListItemText
        style={{
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        primary={option.label}
        secondary={option.secondaryLabel || ''} 
      />
    </ListItem>
    <Divider/>
  </div>
)

class SelectField extends Component {
  componentWillMount = () => {
    if (this.props.relation) {
      this.props.fetchSettingsIfNeeded()
      this.props.fetchFieldsIfNeeded()
      this.props.fetchItemsIfNeeded()
    }
  }

  getOptions() {
    const { relation, items, options, settings } = this.props
    return relation ?
      items.map(item => ({
        id: item.id,
        label: getItemString(item, settings.primaryFields),
        secondaryLabel: getItemString(item, settings.secondaryFields)
      })) :
      options
  }

  arrowMultiRenderer = () => <span>+</span>

  valueToString = (options, value) => {
    options.filter(option => value.includes)
  }

  render = () => {
    const {
      id,
      label,
      required,
      readonly,
      infoMode,
      multi,
      sendFormFieldChange,
      isFetchingSettings,
      isFetchingFields,
      isFetchingItems,
      isUpdating,
      classes
    } = this.props
    const options = this.getOptions()
    let value = null
    if (isObject(this.props.value)) {
      value = Object.keys(this.props.value)
    } else if (this.props.value) {
      value = this.props.value
    }
    const valuesSelected =
      Array.isArray(value) ?
        options.filter(option => value.includes(option.id)) :
        options.find(option => option.id === value)

    return (
      <FormControl fullWidth>
        {label && (
          <FormLabel className={classes.labelSelect}>
            {label}{required && !infoMode && ' *'}
          </FormLabel>
        )}
        <VirtualizedSelect
          className={getInputClassName(classes, infoMode, readonly, required)}
          disabled={readonly || infoMode}
          placeholder=""
          arrowRenderer={infoMode ? null : multi ? this.arrowMultiRenderer : undefined}
          isLoading={isFetchingSettings || isFetchingFields || isFetchingItems || isUpdating}
          options={options}
          optionRenderer={OptionRenderer}
          value={valuesSelected}
          multi={multi}
          labelKey="label"
          valueKey="id"
          onChange={selectedOptions => {
            let value = null
            if (selectedOptions) {
              if (multi) {
                //selectedOptions is an array [{id,label}]
                value = selectedOptions.reduce((values, option) => ({
                  ...values, [option.id]: true
                }), {})
              } else {
                //selectedOptions is an object {id,label}
                value = selectedOptions.id
              }
            }
            sendFormFieldChange(id, value)
          }}
        />
      </FormControl>
    )
  }
}

SelectField.propTypes = {
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

const mapStateToProps = ({ categories, settings, fields, items }, props) => {
  const categoryId = props.relation
  const category = categories.byId[categoryId]
  if (categoryId) {
    return {
      settings: category.settings ? settings.byId[category.settings] : {},
      isFetchingSettings: settings.flow[categoryId].isFetching,
      fields: Object.values(fields.byId).filter(item => category.fields.includes(item.id)),
      isFetchingFields: fields.flow[categoryId].isFetchingAll,
      items: Object.values(items.byId).filter(item => category.items.includes(item.id)),
      isFetchingItems: items.flow[categoryId].isFetchingAll,
      isUpdating: items.flow[categoryId].isUpdating
    }
  }
  return {}
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.relation
  if (categoryId) {
    return {
      fetchSettingsIfNeeded: () => dispatch(fetchSettingsIfNeeded(categoryId)),
      fetchFieldsIfNeeded: () => dispatch(fetchFieldsIfNeeded(categoryId)),
      fetchItemsIfNeeded: () => dispatch(fetchItemsIfNeeded(categoryId))
    }
  }
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectField)
