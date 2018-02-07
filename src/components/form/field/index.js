import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import SelectField from './select'
import SwitchField from './switch'
import ListField from './list'
import TextField from './text'
import { isEqual } from '../../../utils/helpers'

const paddingLeft = 6

const inputStyle = theme => ({
  paddingLeft: paddingLeft,
  paddingRight: paddingLeft,
  borderRadius: 4,
  border: `1px solid ${theme.palette.primary.main}`,
  background: theme.palette.secondary.extraLight,
  fontSize: 14,
  transition: theme.transitions.create(['box-shadow', 'background'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.complex
  }),
  '&:focus': {
    boxShadow: `0 0 0 0.1rem ${theme.palette.primary.main}`
  }
})

const textareaStyle = {
  display: 'inline',
  paddingRight: 0
}

const selectControlStyle = {
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  tableLayout: 'fixed',
  paddingLeft: 0
}

const selectControlActiveStyle = theme => ({
  border: `2px solid ${theme.palette.primary.main}`,
  background: theme.palette.secondary.extraLight,
  boxShadow: 'none'
})

const selectValueStyle = {
  border: 0,
  paddingLeft: `${paddingLeft}px !important`,
  color: 'currentColor'
}

const selectIconsHoverStyle = theme => ({
  color: theme.palette.secondary.dark
})

const selectValueIconStyle = {
  width: 16,
  fontSize: 18,
  padding: 0
}
const selectValueIconHoverStyle = {
  background: 'none'
}

const selectMenuOuterStyle = {
  padding: 0
}

const requiredStyle = theme => ({
  background: theme.palette.secondary.light
})

const readonlyStyle = theme => ({
  cursor: 'default',
  background: theme.palette.grey.light 
})

const infoStyle = theme => ({
  padding: `1px ${paddingLeft-2}px`,
  borderRadius: 0,
  border: 0,
  background: 'transparent',
  fontSize: 14,
  color: theme.palette.grey.dark,
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  cursor: 'default',
  transition: theme.transitions.create('background', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.complex
  })
})

const labelStyle = theme => ({
  fontWeight: 500,
  paddingLeft: paddingLeft-2,
  color: theme.palette.primary.dark
})

const stylesTemp = theme => ({
  inputText: {
    ...inputStyle(theme)
  },
  inputTextRequired: {
    ...inputStyle(theme),
    ...requiredStyle(theme)
  },
  inputTextReadonly: {
    ...inputStyle(theme),
    ...readonlyStyle(theme)
  },
  inputTextInfo: {
    ...infoStyle(theme)
  },
  textarea: {
    ...inputStyle(theme),
    ...textareaStyle
  },
  textareaRequired: {
    ...inputStyle(theme),
    ...requiredStyle(theme),
    ...textareaStyle
  },
  textareaReadonly: {
    ...inputStyle(theme),
    ...readonlyStyle(theme),
    ...textareaStyle
  },
  textareaInfo: {
    ...inputStyle(theme),
    ...infoStyle(theme),
    ...textareaStyle
  },

  inputSelect: {
    '& .Select-control': {
      ...inputStyle(theme),
      ...selectControlStyle
    },
    '&.is-focused:not(.is-open) > .Select-control': { 
      ...selectControlActiveStyle(theme)
    },
    '&.is-open > .Select-control': { 
      ...selectControlActiveStyle(theme)
    },
    '& .Select-value': {
      ...inputStyle(theme),
      ...selectValueStyle
    },
    '& .Select-value-icon': {
      ...selectValueIconStyle
    },
    '& .Select-value-icon:hover': {
      ...selectIconsHoverStyle(theme),
      ...selectValueIconHoverStyle
    },
    '& .Select-menu-outer': {
      ...selectMenuOuterStyle
    },
    '& .Select-clear-zone:hover': {
      ...selectIconsHoverStyle(theme)
    },
    '& .Select-arrow-zone:hover': {
      ...selectIconsHoverStyle(theme)
    }
  },
  inputSelectRequired: {
    '& .Select-control': {
      ...inputStyle(theme),
      ...selectControlStyle,
      background: theme.palette.secondary.light
    },
    '&.is-focused:not(.is-open) > .Select-control': { 
      ...selectControlActiveStyle(theme),
      background: theme.palette.secondary.light
    },
    '&.is-open > .Select-control': { 
      ...selectControlActiveStyle(theme),
      background: theme.palette.secondary.light
    },
    '& .Select-value': {
      ...inputStyle(theme),
      ...selectValueStyle,
      border: `1px solid ${theme.palette.secondary.light}`,
      background: theme.palette.secondary.light
    },
    '& .Select-value-icon': {
      ...selectValueIconStyle
    },
    '& .Select-value-icon:hover': {
      ...selectIconsHoverStyle(theme),
      ...selectValueIconHoverStyle
    },
    '& .Select-menu-outer': {
      ...selectMenuOuterStyle
    },
    '& .Select-clear-zone:hover': {
      ...selectIconsHoverStyle(theme)
    },
    '& .Select-arrow-zone:hover': {
      ...selectIconsHoverStyle(theme)
    }
  },
  inputSelectReadonly: {
    '&.is-disabled > .Select-control': { 
      ...inputStyle(theme),
      ...readonlyStyle(theme)
    }
  },
  inputSelectInfo: {
    '&.is-disabled > .Select-control': { 
      ...infoStyle(theme),
      border: 0,
      marginTop: -16
    },
    '&.is-disabled > .Select-control .Select-value': { 
      paddingTop: 10,
      background: 'transparent',
      fontSize: 14,
      paddingLeft: `${paddingLeft-2}px !important`
    }
  },
  inputSelectMultiInfo: {
    '&.is-disabled > .Select-control': { 
      ...infoStyle(theme),
      border: 0,
      marginTop: 0
    },
    '&.is-disabled > .Select-control .Select-value': { 
      paddingTop: 0,
      fontSize: 14
    }
  },
  inputSwitchFalse: {
    color: theme.palette.primary.main
  },
  inputSwitchTrue: {
    color: theme.palette.primary.main
  },
  inputSwitchDisabled: {
    color: theme.palette.grey.main
  },
  inputList: {
  },
  labelText: {
    ...labelStyle(theme)
  },
  labelSwitch: {
    ...labelStyle(theme),
    fontSize: 11,
    paddingBottom: 1,
    cursor: 'default'
  },
  labelSelect: {
    ...labelStyle(theme),
    fontSize: 12,
    paddingBottom: 3
  },
  helperText: {
    marginTop: 2,
    paddingLeft: 4
  }
})

const styles = theme => ({
  ...stylesTemp(theme),
  inputSelectMultiEdit: {
    ...stylesTemp(theme).inputSelect,
    '& .Select-value': {
      ...stylesTemp(theme).inputSelect['& .Select-value'],
      border: '1px solid #aaa'
    }
  },
  inputSelectMultiEditRequired: {
    ...stylesTemp(theme).inputSelectRequired,
    '& .Select-value': {
      ...stylesTemp(theme).inputSelectRequired['& .Select-value'],
      border: '1px solid #aaa'
    }
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
      case 'string': return <TextField {...this.props} />
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
  sendFormFieldChange: PropTypes.func,
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
    const { relation, type, value, multi } = props
    if (multi) {
      //console.log(props.label, value);
    }
    if (relation && type === 'select' && value) {
      if (!multi && typeof value !== 'string') {
        return new Error(
          `${propName} ${componentName}: Value of single relation field must be an id key`
        )
      } else if (multi && !Array.isArray(value) && typeof value !== 'object') {
        return new Error(
          `${propName} ${componentName}: Value of multiple relation field must be an array of id keys`
        )
      }
    }
  },
  valueListRelation: (props, propName, componentName) => {
    const { relation, type, value } = props
    if (relation && type === 'list' && value && typeof value !== 'object') {
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
