import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchCategoriesIfNeeded } from '../../../actions/categories'
import { fetchSettingsIfNeeded } from '../../../actions/settings'
import { fetchFieldsIfNeeded } from '../../../actions/fields'
import { fetchItemsIfNeeded } from '../../../actions/items'
import { withStyles } from 'material-ui/styles'
import SelectField from './select'
import SwitchField from './switch'
import ListField from './list'
import TextField from './text'

const paddingLeftCommon = 6

const inputCommon = theme => ({
  paddingLeft: paddingLeftCommon,
  paddingRight: 2,
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

const inputLabelCommon = theme => ({
  fontWeight: 300,
  paddingLeft: paddingLeftCommon-2,
  color: theme.palette.primary[500]
})

const styles = theme => ({
  input: {
    ...inputCommon(theme)
  },
  selectInput: {
    '& .Select-control': {
      ...inputCommon(theme),
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      tableLayout: 'fixed',
      paddingLeft: 0
    },
    '& .Select-value': {
      paddingLeft: `${paddingLeftCommon}px !important`
    }
  },
  textarea: {
    display: 'inline',
    marginRight: 10,
    padding: 0
  },
  inputLabel: {
    ...inputLabelCommon(theme)
  },
  inputSwitchLabel: {
    ...inputLabelCommon(theme),
    fontSize: 11,
    paddingBottom: 1
  },
  inputSelectLabel: {
    ...inputLabelCommon(theme),
    fontSize: 12,
    paddingBottom: 3
  },
  helperText: {
    marginTop: 2,
    paddingLeft: 4
  },
  list: {
  }
})

class Field extends Component {

  componentWillMount = () => {
    if (this.props.relation) {
      this.props.fetchCategoriesIfNeeded()
      this.props.fetchSettingsIfNeeded()
      this.props.fetchFieldsIfNeeded()
      this.props.fetchItemsIfNeeded()
    }
  }

  componentDidUpdate = () => {

  }

  render = () => {
    switch(this.props.type) {
      case 'select': return <SelectField {...this.props} />
      case 'boolean': return <SwitchField {...this.props} />
      case 'list': return <ListField {...this.props} />
      default: return <TextField {...this.props} />
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
    if (props.relation && props.type === 'select' && props.value) {
      if (!props.multi && typeof props.value !== 'string') {
        return new Error(
          `${propName} ${componentName}: Value of single relation field must be an id key`
        )
      } else if (props.multi && !Array.isArray(props.value)) {
        return new Error(
          `${propName} ${componentName}: Value of multiple relation field must be an array of id keys`
        )
      }
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

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.relation
  if (categoryId) {
    return {
      fetchCategoriesIfNeeded: () => dispatch(fetchCategoriesIfNeeded()),
      fetchSettingsIfNeeded: () => dispatch(fetchSettingsIfNeeded(categoryId)),
      fetchFieldsIfNeeded: () => dispatch(fetchFieldsIfNeeded(categoryId)),
      fetchItemsIfNeeded: () => dispatch(fetchItemsIfNeeded(categoryId))
    }
  }
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(Field))
