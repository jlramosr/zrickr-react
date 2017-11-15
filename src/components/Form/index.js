/*eslint-disable no-eval*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Field from './field/'
import { withStyles } from 'material-ui/styles'

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
  }
})

class Form extends Component {
  state = {
    item: null,
    size: ''
  }

  _getFieldLabel = (label, fieldView) => fieldView.nolabel ? ' ' : label
  
  _getFieldDescription = (description, fieldView) => 
    fieldView.nodescription ? '' : description || ''

  _getFieldValue = field =>
    this.state.item && field.id ? this.state.item[field.id] : ''

  _handleSubmit = event => {
    console.log('SUBMIT', this.state.item)
    event.preventDefault()
  }

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

  handleFieldChange = (fieldId, value) => {
    this.setState(prevState => {
      let item = prevState.item
      item[fieldId] = value
      return {...prevState, item}
    })
  }

  componentWillMount = () => {
    const { fields, values, theme } = this.props
    let item = new Item(values)
    for (const field of fields) {
      if (field.default && !(field.id in values)) {
        item[field.id] = field.default
      }
    }
    this._resize(theme)
    this.setState({item})
  }

  componentDidMount = () => {
    window.addEventListener('resize', () =>
      this._resize(this.props.theme)
    )
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', () =>
      this._resize(this.props.theme)
    )
  }

  render = () => {
    console.log(this.state.item)
    const { view, cols, fields, classes } = this.props
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
        onSubmit={ event => this._handleSubmit(event)}
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
                  className={classes.field}
                  style={formFieldStyle(item, fieldView, field.id, cols)}
                >
                  <Field
                    {...field}
                    value={item ? item[field.id] : ''}
                    label={this._getFieldLabel(field.label, fieldView)}
                    description={this._getFieldDescription(field.description, fieldView)}
                    order={fieldView.x || 0}
                    handleFormFieldChange={ (fieldId, value) =>
                      this.handleFieldChange(fieldId, value)
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
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  cols: PropTypes.number,
  view: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired
}

Form.defaultProps = {
  cols: 10
}

export default withStyles(styles, {withTheme:true})(Form)

