import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Switch from 'material-ui/Switch';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import CategoryList from '../Category/list';
import { getInfo } from '../../utils/helpers';

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

  switch: {
    alignSelf: 'center',
  },

  switchLabel: {
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
  render() {
    const { 
      id,
      type,
      label,
      description,
      items,
      required,
      value,
      categoryId,
      categorySettings,
      categoryFields,
    } = this.props;

    switch(type) {

      case 'select':
        return (
          <TextField
            error={required && !value}
            key={id}
            name={id}
            select
            fullWidth
            margin="normal"
            style={{
              marginBottom: 14
            }}
            label={label}
            value={value || ''}
            onChange={ event => 
              this.props.handleFormFieldChange(id, event.target.value)
            }
          >
            {
              items && items.map(item => (
                <MenuItem
                  key={item.id}
                  value={item.id}
                >
                  {item.label || getInfo(categorySettings.primaryFields, item)}
                </MenuItem>
              ))
            }
          </TextField>
        );

      case 'radio': 
        return (
          <TextField value={value}/>
        );

      case 'boolean':
        return (
          <Switch
            key={id}
            name={id}
            style={styles.switch}
            label={label}
            checked={Boolean(value)}
            onChange={ (event, value) => 
              this.props.handleFormFieldChange(id, value)
            }
          />
        )

      case 'list':
        return (
          <div>
            { 
              categoryId ? (
                <Paper>
                  <CategoryList
                    relationMode={true}
                    categoryId={categoryId}
                    categoryLabel={label}
                    settings={categorySettings}
                    items={items}
                    fields={categoryFields}
                  />
                </Paper>
              ) : (
                <div>
                  <ListItem
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
            error={required && !value}
            key={id}
            name={id}
            multiline={type==='text'}
            rowsMax="10"
            rows="10"
            fullWidth 
            required={required}
            type={type === 'number' ? 'number' : 'text'}
            label={label}
            helperText={description}
            value={value || ''}
            onChange={ event => 
              this.props.handleFormFieldChange(id, event.target.value)
            }
          />
        )
      }
  }
};

Field.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  items: PropTypes.array,
  categoryId: PropTypes.string,
  categoryLabel: PropTypes.string,
  categorySettings: PropTypes.object,
  categoryFields: PropTypes.array,
  value: PropTypes.any,
  handleFormFieldChange: PropTypes.func,
  itemsSelect: (props, propName, componentName) => {
    if (props.type === 'select' && !props.items) {
      return new Error(
        `${propName} ${componentName}: Select field must to have an array of items or a relation name.`
      );
    }
  },
  idItems: (props, propName, componentName) => {
    for (const item of props.items || []) {
      if (!item.id) {
        return new Error(
          `${propName} ${componentName}: Not item id provided on select/list field.`
        );
      }
    }
  },
};

Field.defaultProps = {
  type: 'string',
};

export default Field;
