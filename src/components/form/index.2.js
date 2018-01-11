/*eslint-disable no-eval*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Field from './field/'
import { isEqual } from '../../utils/helpers'
import { withStyles } from 'material-ui/styles'

/**
 * It represents an item and all changes that may affect it,
 * transforming relational fields to may be read by inputs and
 * evaluating fields conditions. 
 */
class Item {
  constructor(props) {
    const { fields, values } = props
    const simpleValues = {}
    const relationalValues = {}
    for (const fieldId of Object.keys(values)) {
      let value = values[fieldId]
      const isRelational = this.isRelational(value)
      const field = fields.filter(_field => _field.id === fieldId)
      if (!field) {
        if (isRelational) {
          relationalValues[fieldId] = value
        } else {
          simpleValues[fieldId] = value
        }
        continue
      }
      if (!isRelational) {
        if (value !== undefined || value !== null) {
          simpleValues[fieldId] = value
        } else if (!Object.keys(values).length && field.default) {
          simpleValues[fieldId] = field.default
          value = field.default
        } else {
          continue
        }
      } else {
        relationalValues[fieldId] = Object.keys(value).reduce((ids, id) => (
          value[id] ? [...ids, id] : [...ids]
        ), [])
      }
    }
    Object.assign(this, {simpleValues, relationalValues, fields})
  }

  isRelational = value => {
    return value && typeof value === 'object' && !Array.isArray(value)
  }

  addValue = value => {
    if (this.isRelational(value)) {
      this.relationalValues = {...this.relationalValues, ...value}
    } else {
      this.simpleValues = {...this.simpleValues, ...value}
    }
  }

  changeValue = (fieldId, value) => {
    if (this.isRelational(value)) {
      this.relationalValues[fieldId] = value
    } else {
      this.simpleValues[fieldId] = value
    }
  }

  valuesToStore = relationalFields => {
    const values = {...this.simpleValues, ...(relationalFields || this.relationalValues)}
    for (const fieldId of Object.keys(values)) {
      const value = values[fieldId]
      if (Array.isArray(value)) {
        values[fieldId] = value.reduce((obj,id) => ({...obj, [id]: true}), {})
      } 
    }
    return values
  }

  /*jslint evil: true */
  evalCondition = (condition, fieldId) => {
    let fulfilledCondition = false
    try {
      fulfilledCondition = eval(condition.replace('[','this.values['))
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

/**
 * A form with fields and values.
 */
class Form extends Component {
  state = {
    item: null, //all complete item with simple fields and relations fields.
    itemListFields: {}, //only temporary relational fields to removing or adding them.
    isSubmitting: false,
    hasChanged: false
  }

  /**
   * It obtains the final label of the field depending on 
   * the view information of itself. If it has 'nolabel' attribute, 
   * description won't show.
	 * @public
   * @param {string} label The label of the field.
   * @param {object} fieldView The information about the view of the field.
   * @returns {boolean}
	 */
  getFieldLabel = (label, fieldView) =>
    fieldView.nolabel ? ' ' : label

  /**
   * It obtains the final description of the field depending on 
   * the view information of itself. If it has 'nodescription' attribute, 
   * description won't show.
	 * @public
   * @param {string} description The description of the field.
   * @param {object} fieldView The information about the view of the field.
   * @returns {boolean}
	 */
  getFieldDescription = (description, fieldView) => 
    fieldView.nodescription ? '' : description || ''

  /**
   * Call submit function which comes from parent. It uses temporary and
   * controlled values stored in the component state.
	 * @public
   * @returns {void}
	 */  
  handleSubmit = event => {
    event.stopPropagation()
    if (!this.state.isSubmitting) {
      this.setState({isSubmitting: true})
      const { item, itemListFields } = this.state
      item.addValue(itemListFields)
      this.props.handleSubmit(item.valuesToStore()).then(() => {
        this.setState({isSubmitting: false})
      })
    }
  }
  
  /**
   * Update the item state based on user input. Only changes produced
   * on relation fields of list type will be uncontrolled. In return,
   * this temporary changes are stored in other variable state, without
   * removing any entity of lists yet on item state (since submit process). 
	 * @public
   * @param {string} fieldId The field whose value has changed.
   * @param {string} value The new value.
   * @param {bool} isList If the field is a relational list, meaning that value are uncontrolled.
   * @returns {void}
	 */
  handleFieldChange = (fieldId, value, isList=false) => {
    let { item, itemListFields, hasChanged } = this.state
    const { values, origValues, onDifferentValues, onEqualValues } = this.props
    if (isList) {
      itemListFields = {...itemListFields, [fieldId]: value}
      this.setState({itemListFields})
    } else {
      item.changeValue(fieldId, value)
      this.setState({item})
    }
   
    const isDifferentFromOrigin = !isEqual(
      item.valuesToStore(itemListFields), origValues || values
    )
    console.log(isDifferentFromOrigin, item.valuesToStore(itemListFields), values)
    if (!hasChanged && isDifferentFromOrigin) {
      if (onDifferentValues) {
        onDifferentValues()
      }
      this.setState({hasChanged: true})
    }
    if (hasChanged && !isDifferentFromOrigin) {
      if (onEqualValues) {
        onEqualValues()
      }
      this.setState({hasChanged: false})
    }
  }

  restartForm = () => {
    const { fields, values, origValues } = this.props
    this.setState({item: new Item({fields, values: origValues || values})})
  }

  checkCondition = condition => {
    switch (condition) {
      case 'hasChanged':
        return this.state.hasChanged
      case 'hasNotChanged':
        return !this.state.hasChanged
      default:
        return null
    }
  }

  componentDidMount() {
    document.addEventListener('restart-form', this.restartForm)
  }

  componentWillMount = () => {
    const {  fields, values, origValues } = this.props
    const item = new Item({fields, values})
    console.log("HOLA", item);
    this.setState({
      item,
      hasChanged: !isEqual(
        item.valuesToStore(), origValues || values
      )
    })
  }

  componentWillUnmount = () => {
    document.removeEventListener('restart-form', this.restartForm)
  }

  componentWillReceiveProps = nextProps => {
    const currentValues = this.state.item.valuesToStore()
    this.props.checks.forEach((check, index) => {
      const oldCheckHandler = check.handler
      let newCheckHandler = nextProps.checks[index].handler
      newCheckHandler = newCheckHandler === undefined ? true : newCheckHandler
      const checkCallback = check.callback
      const checkCondition = this.checkCondition(check.when)
      if ((oldCheckHandler !== newCheckHandler) && newCheckHandler && checkCallback && (checkCondition !== false)) {
        checkCallback(currentValues)
      }
    })
  }

  render = () => {
    const { view, cols, infoMode, formRef, windowSize, classes } = this.props
    const { item } = this.state

    const formStyle = (cols, infoMode) => ({
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      opacity: infoMode ? 0.9 : 1
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

    let size = 'small'
    if (windowSize === 'sm' || windowSize === 'md') {
      size = 'medium'
    } else if (windowSize === 'lg' || windowSize === 'xl') {
      size = 'large'
    }

    return (
      <form
        ref={formRef}
        onSubmit={this.handleSubmit}
        className={classes.form}
        style={formStyle(cols, infoMode)}
      >
        {
          item.fields.map(field => {
            let fieldView = field.views ? field.views[view] : null
            let value = ''
            if (item.simpleValues && item.simpleValues[field.id]) {
              value = item.simpleValues[field.id]
            } else if (item.relationalValues && item.relationalValues[field.id]){
              value = item.relationalValues[field.id]
            }
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
                    value={value}
                    label={this.getFieldLabel(field.label, fieldView)}
                    description={this.getFieldDescription(field.description, fieldView)}
                    order={fieldView.x || 0}
                    sendFormFieldChange={this.handleFieldChange}
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
  checks: PropTypes.array,
  onDifferentValues: PropTypes.func,
  onEqualValues: PropTypes.func,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

Form.defaultProps = {
  cols: 10,
  infoMode: false,
  checks: []
}

const mapStateToProps = ({ interactions }) => ({ 
  windowSize: interactions.windowSize
})

export default connect(mapStateToProps)(
  withStyles(styles, {withTheme:true})(Form)
)
