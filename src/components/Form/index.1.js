import React, { Component } from 'react';
import Field from './field';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import Media from 'react-media';
import PropTypes from 'prop-types';

const commonStyles = {
  label: {
    color: '#99c3aF'
  },

  underline: {
    borderColor: '#99c3aF',
  }
}

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

  textField: {
    height: '50px',
  },

  input: {
    marginTop: '4px',
  },

  inputUnderline: {
    ...commonStyles.underline
  },

  textLabel: {
    ...commonStyles.label,
    marginTop: '-20px',
    top: '40px',
  },

  toggle: {
    alignSelf: 'center',
  },

  toggleLabel: {
    ...commonStyles.label,
    top: '-2px'
  },

  thumbOff: {
    backgroundColor: '#aaa',
  },
  trackOff: {
    backgroundColor: '#ddd',
  },
  thumbSwitched: {
    backgroundColor: '#004545',
  },
  trackSwitched: {
    backgroundColor: '#00c3cF',
  },
}


class Item {
  constructor(item) {
    Object.assign(this, item);
  }

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
    values: PropTypes.object.isRequired,
    nameFields: (props, propName, componentName) => {
      for (const field of props.fields) {
        if (!field.name) {
          return new Error(
            'Invalid prop `' + propName + '` supplied to' +
            ' `' + componentName + '`. Not field name provided.'
          );
        }
      }
    },
  }

  state = {
    item: null
  }

  _getFieldLabel(field, fieldView) {
    return fieldView.nolabel ? '' : field.label;
  }

  _getFieldValue(field) {
    const { item } = this.state;
    return item ? item[field.name] || '' : '';
  }

  _handleFieldChange(field, value) {
    this.setState(prevState => {
      let item = prevState.item;
      item[field] = value;
      return item; 
    })
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

  _renderField(field, fieldView) {
    switch(field.type) {
      case 'select':
        return (
          <SelectField
            key={field.name}
            name={field.name}
            floatingLabelText={this._getFieldLabel(field, fieldView)}
            value={this._getFieldValue(field)}
            onChange={ (event, value) => this._handleFieldChange(event.target.name, value)}
          >
            {
              field.options && field.options.map(option => (
                <MenuItem
                  key={option.name}
                  value={option.name}
                  primaryText={option.label}
                />
              ))
            }
          </SelectField>
        );
      case 'boolean':
        return (
          <Toggle
            key={field.name}
            name={field.name}
            style={styles.toggle}
            thumbStyle={styles.thumbOff}
            trackStyle={styles.trackOff}
            thumbSwitchedStyle={styles.thumbSwitched}
            trackSwitchedStyle={styles.trackSwitched}
            label={this._getFieldLabel(field, fieldView)}
            labelStyle={styles.toggleLabel}
            toggled={Boolean(this._getFieldValue(field))}
            onToggle={ (event, value) => this._handleFieldChange(event.target.name, value) }
          />
        )
      default: 
        return (
          <TextField
            key={field.name}
            name={field.name}
            style={styles.textField}
            inputStyle={styles.input}
            floatingLabelStyle={styles.textLabel}
            floatingLabelText={this._getFieldLabel(field, fieldView)}
            underlineStyle={styles.inputUnderline}
            underlineFocusStyle={styles.inputUnderline}
            fullWidth={true}
            value={this._getFieldValue(field)}
            onChange={ (event, value) => this._handleFieldChange(event.target.name, value)}
          />
        )
    }
  };

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
            const {views, ...tinyField} = field;
            return (
              fieldView &&
                <div
                  key={field.name}
                  style={styles.formField(item, fieldView, field.name, cols)}
                >
                  { 
                    this._renderField(tinyField, fieldView)
                  }
                </div>
            )
          })  
        }
      </div>
    );
  };

  render() {
    return (
      <div id="form">
        <Media query="(max-width:700px)" render={ _ => (
          this._renderFormContainer('small')
        )}/>
        <Media query="(min-width:701px) and (max-width:1224px)" render={ _ => (
          this._renderFormContainer('medium')
        )}/>
        <Media query="(min-width:1225px)" render={ _ => (
          this._renderFormContainer('large')
        )}/>

      </div>
    );
  }
};

Form.defaultProps = {
  cols: 12
};

export default Form;
