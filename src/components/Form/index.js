/*eslint-disable no-eval*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Field from './field/'
import { withStyles } from 'material-ui/styles'
import { isEqual } from '../../utils/helpers'

class Item {
  constructor(item) {
    Object.assign(this, item)
  }

  /*jslint evil: true */
  evalCondition = (condition, fieldId) => {
    let fulfilledCondition = false
    try {
      fulfilledCondition = eval(condition)
    }
    catch (e) {
      if (e instanceof EvalError || e instanceof SyntaxError) {
        console.warn(
          `${e.name} evaluating "${fieldId}" field showing condition: ${e.message} "${condition}"`
        )
      }
    }
    return fulfilledCondition
  }
}

const styles = theme => ({
  form: {
    padding: theme.spacing.unit*2,
    display: 'grid',
    gridAutoFlow: 'row',
    gridGap: '0px 0px',
    justifyContent: 'stretch',
    alignItems: 'center'
  },
  field: {
    padding: `${theme.spacing.unit/2}px ${theme.spacing.unit}px`
  },
  selectField: {
    padding: `${(theme.spacing.unit/2) - 2}px ${theme.spacing.unit}px ${(theme.spacing.unit/2) + 2}px`
  }
})

class Form extends Component {
  state = {
    item: null,
    itemListFields: {},
    isSubmitting: false,
    size: ''
  }

  _getFieldLabel = (label, fieldView) =>
    fieldView.nolabel ? ' ' : label
  
  _getFieldDescription = (description, fieldView) => 
    fieldView.nodescription ? '' : description || ''

  _getFieldValue = field =>
    this.state.item && field.id ? this.state.item[field.id] : ''

  _resize = theme => {
    const width = window.innerWidth
    let size = 'small'
    if (width > theme.breakpoints.values['lg']) {
      size = 'large'
    } else if (width > theme.breakpoints.values['sm']) {
      size = 'medium'
    }
    if (size !== this.state.size) {
      this.setState({size})
    }
  }

  _generateItem = (fields, values) => {
    let item = new Item(values)
    for (const field of fields) {
      if (field.default && !(field.id in values)) {
        item[field.id] = field.default
      }
    }
    return item
  }

  _handleSubmit = () => {
    if (!this.state.isSubmitting) {
      this.setState({isSubmitting: true})
      const { item, itemListFields } = this.state
      const { evalCondition, ...values} = item
      const newValues = {...values, ...itemListFields}
      this.props.handleSubmit(newValues).then(() => {
        this.setState({isSubmitting: false})
      })
    }
  }
  
  /**
   * Update the item state based on user input. Only changes produced
   * on relation fields of list type will be uncontrolled. In return,
   * this temporary changes are stored in other variable state, without
   * removing any entity of lists yet on item state (since submit process). 
	 * 
	 * @public
   * @param {string} fieldId The field whose value has changed.
   * @param {string} value The new value.
   * @param {bool} isList If the field is a relational list, meaning that value are uncontrolled.
   * @returns {void}
	 */
  handleFieldChange = (fieldId, value, isList=false) => {
    if (isList) {
      this.setState(prevState => ({
        itemListFields: {
          ...prevState.itemListFields,
          [fieldId]: value
        }
      }))
      return
    }
    this.setState(prevState => {
      let item = prevState.item
      item[fieldId] = value
      return {...prevState, item}
    })
  }

  componentWillMount = () => {
    //console.log('MOUNT FORM', this.props)
    const { fields, values } = this.props
    const item = this._generateItem(fields, values)
    this.setState({item})
  }

  componentDidMount = () => {
    window.addEventListener('resize', () =>
      this._resize(this.props.theme)
    )
    this._resize(this.props.theme)
  }

  componentWillUnmount = () => {
    //console.log('UNMOUNT FORM')
    window.removeEventListener('resize', () =>
      this._resize(this.props.theme)
    )
  }

  componentWillReceiveProps = nextProps => {
    if (!isEqual(nextProps,this.props)) {
      this.setState({item: this._generateItem(nextProps.fields, nextProps.values)})
    }
  }

  render = () => {
    //console.log("FORM", this.state.item)
    const { view, cols, fields, infoMode, classes } = this.props
    const { item, size } = this.state

    const formStyle = cols => ({
      gridTemplateColumns: `repeat(${cols}, 1fr)`
    })

    const formFieldStyle = (item, fieldView, fieldId, cols) => {
      if (!item) {
        return {}
      }
      if (fieldView.when && item.evalCondition(fieldView.when, fieldId)) {
        return {display: 'none'}
      }
  
      const { x, y, xs, ys } = fieldView
      let rightBottomX = (xs + x) || 0
      let rightBottomY = (ys + y) || 0
      if (rightBottomY > cols+1) {
        rightBottomY = cols+1
      }

      return {
        gridArea: `
          ${x || 'auto'}/
          ${y || 'auto'}/
          ${rightBottomX || (xs ? `span ${xs}` : 'span 1')}/
          ${rightBottomY || (ys ? `span ${ys}` : `span ${cols+1}`)}
        `
      }
    }

    return (
      <form
        ref={this.props.formRef}
        onSubmit={this._handleSubmit}
        className={classes.form}
        style={formStyle(cols)}
      >
        {
          fields.map(field => {
            let fieldView = field.views ? field.views[view] : null
            if (fieldView && size in fieldView) {
              fieldView = fieldView[size]
            }

            return (
              fieldView &&
                <div
                  key={field.id}
                  className={field.type==='select' ? classes.selectField : classes.field}
                  style={formFieldStyle(item, fieldView, field.id, cols)}
                >
                  <Field
                    {...field}
                    required={item.evalCondition(field.required,field.id)}
                    readonly={item.evalCondition(field.readonly,field.id)}
                    infoMode={infoMode}
                    value={item ? item[field.id] : ''}
                    label={this._getFieldLabel(field.label, fieldView)}
                    description={this._getFieldDescription(field.description, fieldView)}
                    order={fieldView.x || 0}
                    handleFormFieldChange={ (fieldId, value, isList) =>
                      this.handleFieldChange(fieldId, value, isList)
                    }
                  />
                </div>
            )
          })
        } 
      </form>
    )
  }
}

Form.propTypes = {
  cols: PropTypes.number,
  infoMode: PropTypes.bool,
  view: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  formRef: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

Form.defaultProps = {
  cols: 10,
  infoMode: false
}

export default withStyles(styles, {withTheme:true})(Form)
