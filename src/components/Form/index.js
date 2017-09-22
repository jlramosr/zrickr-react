import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import './index.css';

class Form extends Component {

  handleChange(field) {
    console.log("HANDLECHANGE", field);
  }

  _renderField(field, item) {
    switch(field.type) {
      case 'select':
        return (
          <SelectField
            key={field.name}
            floatingLabelText={field.label}
            value={item[field.name]}
            onChange={ event => this.handleChange(event.target.value)}
          >
            {
              field.options && field.options.map(option => (
                <MenuItem key={option.name} value={option.name} primaryText={option.label} />
              ))
            }
          </SelectField>
        );
      case 'boolean':
        return (
          <Toggle key={field.name}/>
        )
      default: 
        return (
          <TextField
            key={field.name}
            hintText={field.label}
            value={item[field.name]}
          />
        )
    }
  }

  render() {
    const { fields, item } = this.props;
    return (
      <form className="form">
        {
          fields.map(field => {
            return (
              <div key={field.name} className="form-field">
                { this._renderField(field, item) }
              </div>
            )
          })  
        }
      </form>
    );
  }
}

export default Form;
