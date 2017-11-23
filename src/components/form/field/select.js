import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchSettingsIfNeeded } from '../../../actions/settings'
import { fetchFieldsIfNeeded } from '../../../actions/fields'
import { fetchItemsIfNeeded } from '../../../actions/items'
import { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import { FormControl, FormLabel } from 'material-ui/Form'
import { getItemInfo } from '../../category/utils/helpers'

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

  _getOptions() {
    return this.props.relation ?
      this.props.items.map(item => ({
        id: item.id,
        label: getItemInfo(this.props.settings.primaryFields, item),
        secondaryLabel: getItemInfo(this.props.settings.secondaryFields, item)
      })) :
      this.props.options
  }

  _arrowRenderer = () => <span>+</span>

  render = () => {
    const {
      id,
      value,
      label,
      relation,
      multi,
      handleFormFieldChange,
      isFetchingSettings,
      isFetchingFields,
      isFetchingItems,
      classes
    } = this.props
    const options = this._getOptions()
    return (
      <FormControl fullWidth>
        {label && (
          <FormLabel className={classes.inputSelectLabel}>
            {label}
          </FormLabel>
        )}
        <VirtualizedSelect
          className={classes.selectInput}
          arrowRenderer={multi ? this._arrowRenderer : undefined}
          placeholder=""
          optionRenderer={OptionRenderer}
          options={options}
          value={value ?
            (
              Array.isArray(value) ?
                options.filter(option => value.includes(relation ? option.id : option.label)) :
                options.find(option => (relation ? option.id : option.label) === value)
            ) :
            null
          }
          multi={multi}
          isLoading={isFetchingSettings || isFetchingFields || isFetchingItems}
          labelKey="label"
          valueKey="id"
          onChange={selectedOptions => {
            let value = null
            if (selectedOptions) {
              if (multi) {
                value = selectedOptions.reduce((value, option) => [
                  ...value, relation ? option.id : option.label
                ], [])
              } else {
                //options is an object {id,label}
                value = relation ? selectedOptions.id : selectedOptions.label
              }
            }
            handleFormFieldChange(id, value)
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
  options: PropTypes.array,
  relation: PropTypes.string,
  value: PropTypes.any,
  order: PropTypes.number,
  handleFormFieldChange: PropTypes.func
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
      isFetchingItems: items.flow[categoryId].isFetchingAll
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
