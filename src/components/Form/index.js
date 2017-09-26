import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import Media from 'react-media';

const commonStyles = {
  label: {
    color: '#99c3aF'
  },

  underline: {
    borderColor: '#99c3aF',
  }
}

const styles = {
  formContainer: (cols=12) => ({
    padding: '20px',
    display: 'grid',
    gridAutoFlow: 'row',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridGap: '0px 0px',
    justifyContent: 'stretch',
    alignItems: 'center'
  }),

  formField: (fields,view,cols=12) => {
    let formFieldStyle = {
      padding: '0 10px',
      display: view.when ? 'none' : 'block'
    }
    const { x, y, xs, ys } = view;
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
};

class Form extends Component {
  state = {
    values: []
  }

  handleChange(field, value) {
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        [field]:value
      } 
    }))
  }

  componentDidMount() {
    this.setState({
      values: this.props.item
    });
  }

  _renderField(field, item) {
    switch(field.type) {
      case 'select':
        return (
          <SelectField
            key={field.name}
            name={field.name}
            floatingLabelText={field.label}
            value={this.state.values[field.name] || ''}
            onChange={ (event, value) => this.handleChange(event.target.name, value)}
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
          <Toggle
            key={field.name}
            name={field.name}
            style={styles.toggle}
            thumbStyle={styles.thumbOff}
            trackStyle={styles.trackOff}
            thumbSwitchedStyle={styles.thumbSwitched}
            trackSwitchedStyle={styles.trackSwitched}
            label={field.label}
            labelStyle={styles.toggleLabel}
            value={this.state.values[field.name] || ''}
            onToggle={ (event, value) => this.handleChange(event.target.name, value) }
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
            floatingLabelText={field.label}
            underlineStyle={styles.inputUnderline}
            underlineFocusStyle={styles.inputUnderline}
            fullWidth={true}
            value={this.state.values[field.name] || ''}
            onChange={ (event, value) => this.handleChange(event.target.name, value)}
          />
        )
    }
  };

  _renderFormContainer(size) {
    const { view, cols, fields, item } = this.props;
    return (
      <div id="formContainer" style={styles.formContainer(cols)}>
        {
          fields.map(field => {
            const fieldView = field.views ? field.views[view] : null;
            const {views, ...tinyField} = field;
            return (
              fieldView &&
                <div
                  key={field.name}
                  style={
                    size in fieldView ? 
                      styles.formField(fields,fieldView[size]) :
                      styles.formField(fields,fieldView)
                  }
                >
                  { 
                    this._renderField(tinyField, item)
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

export default Form;
