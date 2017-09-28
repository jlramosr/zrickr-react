/*eslint-disable no-eval*/
import React, { Component } from 'react';
import Media from 'react-media';
import Field from './field';
import PropTypes from 'prop-types';

const styles = {
  formContainer: (cols) => ({
    padding: '20px',
    display: 'grid',
    gridAutoFlow: 'row',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridGap: '0px 0px',
    justifyContent: 'stretch',
    alignItems: 'center'
  }),

  formField: (item, fieldView, fieldName, cols) => {
    if (!item) {
      return {};
    }
    if (fieldView.when && item.evalCondition(fieldView.when, fieldName)) {
      return {display: 'none'};
    }

    let formFieldStyle = {padding: '0 10px'}
    const { x, y, xs, ys } = fieldView;
    let rightBottomX = (xs + x) || 0;
    let rightBottomY = (ys + y) || 0;
    if (rightBottomY > cols+1) {
      rightBottomY = cols+1;
    } 
    formFieldStyle['gridArea'] = `
      ${x || 'auto'}/
      ${y || 'auto'}/
      ${rightBottomX || (xs ? `span ${xs}` : 'span 1')}/
      ${rightBottomY || (ys ? `span ${ys}` : `span ${cols+1}`)}
    `;
    return formFieldStyle;
  },
}


class Item {
  constructor(item) {
    Object.assign(this, item);
  }

  /*jslint evil: true */
  evalCondition(condition, fieldName) {
    let fulfilledCondition = false;
    try {
      fulfilledCondition = eval(condition);
    }
    catch (e) {
      if (e instanceof EvalError || e instanceof SyntaxError) {
        console.warn(
          `${e.name} evaluating "${fieldName}" field showing condition: ${e.message} "${condition}"`
        );
      }
    }
    return fulfilledCondition;
  }
}

class Form extends Component {
  static propTypes = {
    cols: PropTypes.number,
    view: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    values: PropTypes.object.isRequired
  }

  static defaultProps = {
    cols: 10
  }

  state = {
    item: null
  }

  _getFieldLabel(label, fieldView) {
    return fieldView.nolabel ? '' : label;
  }

  _getFieldValue(field) {
    const { item } = this.state;
    return item ? item[field.name] || '' : '';
  }

  handleFieldChange(field, value) {
    this.setState(prevState => {
      let item = prevState.item;
      item[field] = value;
      return item;
    })
  }

  handleSubmit(event) {
    console.log("SUBMIT", this.state.item);
    event.preventDefault();
  }

  componentDidMount() {
    let item = new Item(this.props.values)
    const { fields, values } = this.props;
    for (const field of fields) {
      if (field.default && !(field.name in values)) {
        item[field.name] = field.default;
      }
    }
    this.setState({item});
  }

  _renderFormContainer(size) {
    const { view, cols, fields } = this.props;
    const { item } = this.state;
    return (
      <div id="formContainer" style={styles.formContainer(cols)}>
        {
          fields.map(field => {
            let fieldView = field.views ? field.views[view] : null;
            if (fieldView && size in fieldView) {
              fieldView = fieldView[size];
            }
            return (
              fieldView &&
                <div
                  key={field.name}
                  style={styles.formField(item, fieldView, field.name, cols)}
                >
                  { 
                    <Field
                      name={field.name}
                      type={field.type}
                      label={this._getFieldLabel(field.label, fieldView)}
                      options={field.options}
                      relation={field.relation}
                      value={item ? item[field.name] : ''}
                      handleFormFieldChange={ (fieldName, value) => 
                        this.handleFieldChange(fieldName, value)
                      }
                    />
                  }
                </div>
            )
          })
        }
        <input type="submit" value="HOLA" style={{display:''}}/>  
      </div>
    );
  };

  render() {
    return (
      <form onSubmit={ (event) => this.handleSubmit(event)}>
        <Media query="(max-width:700px)" render={ _ => (
          this._renderFormContainer('small')
        )}/>
        <Media query="(min-width:701px) and (max-width:1224px)" render={ _ => (
          this._renderFormContainer('medium')
        )}/>
        <Media query="(min-width:1225px)" render={ _ => (
          this._renderFormContainer('large')
        )}/>
      </form>
    );
  }
};

export default Form;
