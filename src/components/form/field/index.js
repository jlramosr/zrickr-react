import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import SelectField from './select'
import SwitchField from './switch'
import ListField from './list'
import TextField from './text'
import { isEqual } from '../../../utils/helpers'

const paddingLeft = 6

const input = theme => ({
  paddingLeft: paddingLeft,
  paddingRight: paddingLeft,
  borderRadius: 4,
  border: `1px solid ${theme.palette.primary[500]}`,
  background: theme.palette.secondary[50],
  fontSize: 14,
  transition: theme.transitions.create(
    ['box-shadow']
  ),
  '&:focus': {
    boxShadow: `0 0 0 0.1rem ${theme.palette.primary[500]}`
  }
})

const label = theme => ({
  fontWeight: 500,
  paddingLeft: paddingLeft-2,
  color: theme.palette.primary[500]
})


const styles = theme => ({
  inputText: {
    ...input(theme)
  },
  inputTextRequired: {
    ...input(theme),
    background: theme.palette.secondary[200]
  },
  inputTextReadonly: {
    ...input(theme),
    background: theme.palette.grey[200]    
  },
  inputTextInfo: {
    padding: `1px ${paddingLeft-2}px`,
    borderRadius: 4,
    border: 0,
    background: 'transparent',
    fontSize: 14,
    color: theme.palette.grey[700],
    borderBottom: `1px solid ${theme.palette.primary[200]}`,
    cursor: 'default'
  },
  inputSelect: {
    '& .Select-control': {
      ...input(theme),
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      tableLayout: 'fixed',
      paddingLeft: 0
    },
    '& .Select-value': {
      ...input(theme),
      paddingLeft: `${paddingLeft}px !important`,
      border: 0
    },
    '& .Select-menu-outer': {
      padding: 0
    }
  },
  inputSelectRequired: {
    '& .Select-control': {
      ...input(theme),
      background: theme.palette.secondary[200],
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      tableLayout: 'fixed',
      paddingLeft: 0
    },
    '& .Select-value': {
      ...input(theme),
      background: theme.palette.secondary[200],
      paddingLeft: `${paddingLeft}px !important`,
      border: 0
    },
    '& .Select-menu-outer': {
      padding: 0
    }
  },
  inputSelectReadonly: {
    '& .Select-control': {
      ...input(theme),
      background: theme.palette.grey[200]
    },
    '& .Select-value': {
      ...input(theme),
      background: theme.palette.grey[200]
    }
  },
  inputSelectInfo: {
    '& .Select-control': {
      border: 0
    },
    '& .Select-value': {
      background: 'transparent',
      fontSize: 14,
      paddingLeft: `${paddingLeft-2}px !important`
    }
  },
  inputSwitchFalse: {
    color: theme.palette.grey[200]
  },
  inputSwitchTrue: {
    color: theme.palette.primary[400]
  },
  inputList: {
  },
  labelText: {
    ...label(theme)
  },
  labelSwitch: {
    ...label(theme),
    fontSize: 11,
    paddingBottom: 1,
    cursor: 'default'
  },
  labelSelect: {
    ...label(theme),
    fontSize: 12,
    paddingBottom: 3
  },
  textarea: {
    display: 'inline',
    marginRight: 10,
    padding: 0
  },
  helperText: {
    marginTop: 2,
    paddingLeft: 4
  }
})

class Field extends Component {

  shouldComponentUpdate = nextProps => {
    if (!isEqual(this.props, nextProps)) {
      return true
    }
    return false
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
  type: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
  infoMode: PropTypes.bool,
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

export default (withStyles(styles, {withTheme: true})(Field))
