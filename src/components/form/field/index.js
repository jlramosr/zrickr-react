import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import Switch from 'material-ui/Switch'
import { ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import CategoryList from '../../category/list'
import Select from './select'

const inputCommon = theme => ({
  paddingLeft: 2,
  paddingRigth: 2,
  borderRadius: 4,
  border: `1px solid ${theme.palette.primary[500]}`,
  fontSize: 14,
  background: theme.palette.secondary[50],
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:focus': {
    borderColor: theme.palette.primary[500],
    boxShadow: `0 0 0 0.1rem ${theme.palette.primary[500]}`
  }
})

const styles = theme => ({
  input: {
    ...inputCommon(theme)
  },
  selectInput: {
    '& .Select-control': {
      ...inputCommon(theme)
    }
  },
  textarea: {
    display: 'inline',
    padding: 0
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: theme.palette.primary[500]
  },
  helperText: {
    marginTop: 2
  }
})

class Field extends Component {

  render = () => {
    const {
      id,
      type,
      label,
      description,
      required,
      value,
      relation,   
      order,
      classes
    } = this.props

    switch(type) {

      case 'select': return (
        <Select {...this.props} />
      )

      case 'radio': 
        return (
          <TextField value={value}/>
        )

      case 'boolean':
        return (
          <Switch
            key={id}
            name={id}
            className={classes.switch}
            label={label}
            checked={Boolean(value)}
            onChange={ (event, value) => 
              this.props.handleFormFieldChange(id, value)
            }
          />
        )

      case 'list':
        return (
          relation ? (
            <Paper elevation={4} className={classes.list}>
              <CategoryList
                relationMode={true}
                tableMode={false}
                categoryId={relation}
                categoryLabel={label || this.props.relationLabel}
                categorySettingsId={this.props.relationSettingsId}
                categoryFieldsIds={this.props.relationFieldsIds}
                categoryItemsIds={this.props.relationItemsIds}
                showAvatar={false}
              />
            </Paper>
          ) : (
            <div>
              <ListItem
                disabled
              />
              <Divider/>
            </div>
          )
        )

      default: 
        return (
          <TextField
            inputClassName={classes.input}
            labelClassName={classes.inputLabel}
            error={required && !value}
            key={id}
            name={id}
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
            onChange={ event =>
              this.props.handleFormFieldChange(id, event.target.value)
            }
          />
        )
    }
  }
}

Field.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.array,
  relation: PropTypes.string,
  value: PropTypes.any,
  order: PropTypes.number,
  handleFormFieldChange: PropTypes.func,
  itemsSelect: (props, propName, componentName) => {
    if (props.type === 'select' && !props.options && !props.relation) {
      return new Error(
        `${propName} ${componentName}: Select field ${props.id} must to have an array of options or a relation name.`
      )
    }
  },
  optionsId: (props, propName, componentName) => {
    for (const option of props.options || []) {
      if (!option.id) {
        return new Error(
          `${propName} ${componentName}: Not option id provided on select/list field.`
        )
      }
    }
  },
  valueSelectRelation: (props, propName, componentName) => {
    if (props.relation && props.type === 'select' && props.value && typeof props.value !== 'string') {
      return new Error(
        `${propName} ${componentName}: Value of relation field must be an id key`
      )
    }
  },
  valueListRelation: (props, propName, componentName) => {
    if (props.relation && props.type === 'list' && props.value && typeof props.value !== 'object') {
      return new Error(
        `${propName} ${componentName}: Value of relation field must be an id key`
      )
    }
  }
}

Field.defaultProps = {
  type: 'string'
}

const mapStateToProps = ({ categories }, props) => {
  if (props.relation) {
    return {
      relationLabel: categories.byId[props.relation].label || '',
      relationSettingsId: categories.byId[props.relation].settings || {},
      relationFieldsIds: categories.byId[props.relation].fields || [],
      relationItemsIds: categories.byId[props.relation].items || []
    }
  }
  return {}
}

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(Field))
