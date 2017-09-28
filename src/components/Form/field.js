import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import {List, ListItem} from 'material-ui/List';
import { Link } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { getInfo, capitalize } from './helpers'
import CategoryList from '../Category/list';
import Paper from 'material-ui/Paper';
import Plus from 'react-icons/lib/fa/plus';
import PropTypes from 'prop-types';

const commonStyles = {
  label: {
    color: '#99c3aF'
  },

  underline: {
    backgroundColor: '#99c3aF',
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

  textHeaderList: {
    ...commonStyles.underline,
    color: '#fff',
    padding: '6px',
    lineHeight: '20px',
    marginTop: '20px',
  },

  underlineHeaderList: {
    ...commonStyles.underline,
  },

  listItems: {
    padding: '6px'
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
    options: PropTypes.array,
    category: PropTypes.string,
    value: PropTypes.any,
    handleFormFieldChange: PropTypes.func,
    optionsSelect: (props, propName, componentName) => {
      if (props.type === 'select' && !props.options) {
        return new Error(
          `${propName} ${componentName}: Select field must to have an array of options.`
        );
      }
    },
    nameOptions: (props, propName, componentName) => {
      for (const option of props.options || []) {
        if (!option.name) {
          return new Error(
            `${propName} ${componentName}: Not option name provided on select field.`
          );
        }
      }
    },
  }

  static defaultProps = {
    type: 'string'
  };

  render() {
    const { name, type, label, options, relation, value } = this.props;

    switch(type) {

      case 'select':
        return (
          <SelectField
            key={name}
            name={name}
            floatingLabelText={label}
            value={value}
            onChange={ (event, value) => 
              this.props.handleFormFieldChange(this.props.name, value)
            }
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
            onToggle={ (event, value) => 
              this.props.handleFormFieldChange(this.props.name, value)
            }
          />
        )

      case 'list':
        const categoryName = relation;
        return (
          <div>
            { 
              relation ? (
                <Paper zDepth={1}>
                  <CategoryList
                    form={true}
                    category={
                      require(`../App/data/categories`).default
                        .find(category => 
                          category.name.toLowerCase() === categoryName.toLowerCase()
                        )
                    }
                    settings={
                      require(`../${capitalize(categoryName)}/data/settings`).default
                    }
                    items={
                      require(`../${capitalize(categoryName)}/data/items`).default
                        .filter(item => value.includes(item.id))
                    }
                    fields={
                      require(`../${capitalize(categoryName)}/data/fields`).default
                    }
                    operations={[
                      {id:'plus', icon:Plus, right: true, onClick: _ => this._openNewDialog()}
                    ]}
                  />
                </Paper>
              ) : (
                <div>
                  <ListItem
                    primaryText={'hola'}
                    disabled
                  />
                  <Divider/>
                </div>
              )
            }
          </div>
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
            value={value || ''}
            onChange={ (event, value) => 
              this.props.handleFormFieldChange(this.props.name, value)
            }
          />
        )
      }
  }
};

export default Field;
