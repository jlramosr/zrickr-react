import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import './index.css';

const _formStyle = {
  width: '100%',
}

const _formContainerStyle = cols => ({
  width: '100%',
  padding: '0',
  display: 'grid',
  gridAutoFlow: 'row',
  gridAutoRows: '1fr',
  gridTemplateColumns: `repeat(${cols || 100}, 1fr)`,
  gridTemplateRows: 'repeat(auto-fill, 60px)',
  gridGap: '10px 10px',
  justifyContent: 'stretch',
  alignItems: 'center',
  background: '#aaa'
})

const _formFieldStyle = view => {
  let formFieldStyle = {
    justifyContent: 'center',
    alignItems: 'start',
    padding: '0 10px',
    border: '1px solid black',
    margin: '-1px',
    background: '#ddd',
  }

  const { x, y, xs, ys } = view;
  let rightBottomX = (xs + x) || 0;
  let rightBottomY = (ys + y) || 0;
  if (rightBottomY > 7) {
    rightBottomY = 7;
  } 

  formFieldStyle['gridArea'] = `
    ${x || 'auto'}/
    ${y || 'auto'}/
    ${rightBottomX || (xs ? `span ${xs}` : 'span 1')}/
    ${rightBottomY || (ys ? `span ${ys}` : 'span 7')}
  `;

  return formFieldStyle;
}

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
            floatingLabelText={field.label}
            fullWidth={true}
            value={item[field.name]}
          />
        )
    }
  }

  render() {
    const { type, cols, fields, item } = this.props;
    return (
      <div style={_formStyle}>
        <div style={_formContainerStyle(cols)}>
          {
            fields.map(field => {
              return (
                type in field &&
                  <div key={field.name} style={_formFieldStyle(field[type])}>
                    { 
                      this._renderField(field, item)
                    }
                  </div>
              )
            })  
          }
        </div>
      </div>
    );
  }
}

export default Form;
