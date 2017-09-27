import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
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

class Field extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.array
  }

  state = {
    value: ''
  }

  _handleChange(value) {
    this.setState({value});
    const { name, handleFormFieldChange } = this.props;
    handleFormFieldChange(name, value);
  }

  componentWillReceiveProps (props) {
    console.log("RECEIVE PROPS");
    this.setState({value: props.value});
  }

  render() {
    const { name, type, label, options } = this.props;
    const { value } = this.state;

    console.log("HOLA", this.state);

    switch(type) {
      case 'select':
        return (
          <SelectField
            key={name}
            name={name}
            floatingLabelText={label}
            value={value}
            onChange={ (event, value) => this._handleChange(value)}
          >
            {
              options && options.map(option => (
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
            key={name}
            name={name}
            style={styles.toggle}
            thumbStyle={styles.thumbOff}
            trackStyle={styles.trackOff}
            thumbSwitchedStyle={styles.thumbSwitched}
            trackSwitchedStyle={styles.trackSwitched}
            label={label}
            labelStyle={styles.toggleLabel}
            toggled={Boolean(value)}
            onToggle={ (event, value) => this._handleChange(value) }
          />
        )
      default: 
        return (
          <TextField
            key={name}
            name={name}
            style={styles.textField}
            inputStyle={styles.input}
            floatingLabelStyle={styles.textLabel}
            floatingLabelText={label}
            underlineStyle={styles.inputUnderline}
            underlineFocusStyle={styles.inputUnderline}
            fullWidth={true}
            value={value}
            onChange={ (event, value) => this._handleChange(value) }
          />
        )
      }
  }
};

Field.defaultProps = {
  type: 'string'
};

export default Field;
