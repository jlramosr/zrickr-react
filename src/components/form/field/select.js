import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import { FormControl, FormLabel } from 'material-ui/Form'
import { getItemInfo } from '../../category/utils/helpers'
import Field from './index.js'

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
  state = {
    options: []
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

  _loadOptions = (input, callback) => {
    const data = {
      options: this.state.options,
      complete: false
    }
    callback(null, data)
  }

  _arrowRenderer = () => <span>+</span>

  componentWillMount() {
    this.setState({options: this._getOptions()})
  }

  render = () => {
    const {
      id,
      value,
      label,
      relation,
      multi,
      handleFormFieldChange,
      isFetchingItems,
      classes
    } = this.props

    const { options } = this.state

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
          loadOptions={this._loadOptions}
          isLoading={isFetchingItems}
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

SelectField.propTypes = Field.propTypes

SelectField.defaultProps = {
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

export default connect(mapStateToProps)(SelectField)
