/*eslint-disable no-eval*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Field from './field/'
import { isEqual, isObject } from '../../utils/helpers'
import { withStyles } from 'material-ui/styles'

/**
 * It represents an item and all changes that may affect it,
 * transforming relational fields to may be read by inputs and
 * evaluating fields conditions. 
 */
class Item {
  constructor(props) {
    const { fields, values } = props
    this.setValues(values)
    this.setFields(fields)
  }

  setValues = values => this.values = {...values}

  setValue = (fieldId, value) => {
    if (
      (isObject(value) && !Object.keys(value).length) ||
      (typeof value === 'string' && value === '') ||
      (typeof value === 'boolean' && value === false)
    ) {
      delete this.values[fieldId]
    } else {
      this.values[fieldId] = value
    }
  }

  setFields = fields => this.fields = [...fields]

  getValues = () => this.values

  getValue = fieldId => this.values[fieldId]

  getFields = () => this.fields

  /**
   * It transforms temporary removed and added items of relational fields.
   */
  cleanRelations = () => {
    this.values = Object.keys(this.values).reduce((values, fieldId) => {
      const value = this.values[fieldId]
      let newValue = value
      if (isObject(value)) {
        newValue = Object.keys(value).reduce((values, id) => {
          if (value[id] === true || value[id] === 'added') {
            return {...values, [id]: true}
          }
          return {...values}
        }, {})
      }
      return {...values, [fieldId]: newValue}
    }, {})
  }

  /*jslint evil: true*/
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
    display: 'grid',
    gridAutoFlow: 'row',
    gridGap: '0px 0px',
    justifyContent: 'stretch',
    alignItems: 'center',
    padding: theme.spacing.unit/2,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      padding: theme.spacing.unit
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit*2
    }
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
    isSubmitting: false,
    hasChanged: false
  }

  componentWillMount = () => {
    const { fields, origValues, values } = this.props
    const item = new Item({fields, values})
    this.setState({item, hasChanged: !isEqual(item.getValues(), origValues || values)})
  }

  componentWillReceiveProps = nextProps => {
    const { item } = this.state
    const { checks, values, fields } = this.props
    if (!isEqual(values, nextProps.values)) {
      this.setState({
        item: new Item({fields, values: nextProps.values})
      })
      return
    }
    checks.forEach((check, index) => {
      const oldCheckHandler = check.handler
      let newCheckHandler = nextProps.checks[index].handler
      newCheckHandler = newCheckHandler === undefined ? true : newCheckHandler
      const checkCallback = check.callback
      const checkCondition = this.checkCondition(check.when)
      if ((oldCheckHandler !== newCheckHandler) && newCheckHandler && checkCallback && (checkCondition !== false)) {
        checkCallback(item.getValues())
      }
    })
  }

  componentDidMount() {
    this._isMounted = true
    document.addEventListener('restart-form', this.restartForm)
  }

  componentWillUnmount = () => {
    this._isMounted = false
    document.removeEventListener('restart-form', this.restartForm)
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
   * Update the item state based on user input.
	 * @public
   * @param {string} fieldId The field whose value has changed.
   * @param {string} value The new value.
   * @returns {void}
	 */
  handleFieldChange = (fieldId, value) => {
    let { item, hasChanged } = this.state
    const { origValues, values, onDifferentValues, onEqualValues } = this.props
    item.setValue(fieldId, value)
    this.setState({item})
    const isDifferentFromOrigin = !isEqual(item.getValues(), origValues || values)
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
      const { item } = this.state
      const { fields, handleSubmit, onEqualValues } = this.props
      const itemSubmit = new Item({fields, values: item.getValues()})
      itemSubmit.cleanRelations()
      handleSubmit(itemSubmit.getValues()).then(() => {
        if (this._isMounted) {
          const item = new Item({fields, values: this.props.values})
          this.setState({item, hasChanged: false, isSubmitting: false})
          if (onEqualValues) {
            onEqualValues()
          }
        }
      })
    }
  }

  restartForm = () => {
    const { fields, values, origValues, onEqualValues } = this.props
    this.setState({hasChanged: false, item: new Item({fields, values: origValues || values})})
    if (onEqualValues) {
      onEqualValues()
    }
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

  getWindowSize = () => {
    const { windowSize } = this.props
    if (windowSize === 'sm' || windowSize === 'md') {
      return 'medium'
    } else if (windowSize === 'lg' || windowSize === 'xl') {
      return 'large'
    }
    return 'small'
  }

  render = () => {
    const { view, cols, readonly, infoMode, formRef, classes } = this.props
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

    const size = this.getWindowSize()
    const fields = item.getFields()

    return (
      <form
        ref={formRef}
        onSubmit={this.handleSubmit}
        className={classes.form}
        style={formStyle(cols, infoMode)}
      >
        {
          fields.map(field => {
            let fieldView = field.views ? field.views[view] : null
            if (fieldView && size in fieldView) {
              fieldView = fieldView[size]
            }
            const values = item.getValues()
            const value = values[field.id] ? values[field.id] : ''
            const isRequired = item.evalCondition(field.required,field.id)
            const isReadonly = readonly || field.id === 'state' || item.evalCondition(field.readonly,field.id)

            return (
              fieldView &&
                <div
                  key={field.id}
                  className={field.type==='select' ? classes.selectField : classes.field}
                  style={formFieldStyle(item, fieldView, field.id, cols)}
                >
                  <Field
                    {...field}
                    required={isRequired}
                    readonly={isReadonly}
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
  readonly: PropTypes.bool,
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
  checks: [],
  readonly: false
}

const mapStateToProps = ({ interactions }) => ({ 
  windowSize: interactions.windowSize
})

export default connect(mapStateToProps)(
  withStyles(styles, {withTheme:true})(Form)
)
