import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import API from '../../utils/api';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Switch from 'material-ui/Switch';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import CategoryList from '../Category/list';
import { getInfo } from '../../utils/helpers';

const styles = theme => ({
  textField: {

  },
  select: {

  },
  list: {
    marginTop: theme.spacing.unit*2,
  },
  toogle: {

  },
});

class Field extends Component {
  state = {
    relationSettings: {},
    relationFields: [],
    relationItems: [],
    relationLoading: true,
  }

  _getData = relationId => {
    let { value, type } = this.props;
    let getItemsPromises = [];
    value = value || {};
    if (type === 'list') {
      getItemsPromises = Object.keys(value).map(relationItemId =>
        API('local').getDocument('categories_items', relationId, relationItemId)
      )
    } else if (type === 'select') {
      getItemsPromises.push(
        API('local').getCollection('categories_items', relationId)
      )
    }
    Promise.all([
      API('local').getDocument('categories_settings', relationId),
      API('local').getCollection('categories_fields', relationId),
      ...getItemsPromises,
    ])
      .then(values => {
        let [relationSettings, relationFields, ...relationItems] = values;
        if (relationItems.length === 1 && Array.isArray(relationItems[0])) {
          relationItems = relationItems[0];
        }
        const icon = relationSettings.icon;
        relationSettings['icon'] = icon  ?
          (typeof icon === 'string' ? require('material-ui-icons')[icon] : icon) : 
          null
        this.setState({
          relationSettings,
          relationFields,
          relationItems,
          relationLoading: false
        });
      })
      .catch(error => {
        console.log("ERROR PIDIENDO DATOS RELACIÓN", error);
      })
  }

  componentDidMount = _ => {
    const { relationId } = this.props;
    if (relationId) {
      this._getData(relationId);
    }
  }

  render() {
    const {
      id,
      type,
      label,
      description,
      options,
      required,
      value,
      relationId,
      classes,
    } = this.props;

    const {
      relationSettings,
      relationFields,
      relationItems,
      relationLoading,
    } = this.state;

    switch(type) {

      case 'select':
        return (
          <TextField
            className={classes.select}
            error={required && !value}
            key={id}
            name={id}
            select
            fullWidth
            margin="normal"
            label={label}
            value={value || ''}
            onChange={ event => 
              this.props.handleFormFieldChange(id, event.target.value)
            }
          >
            {relationId ? (
              relationItems.map(item => (
                <MenuItem
                  key={item.id}
                  value={item.id}
                >
                  {getInfo(relationSettings.primaryFields, item)}
                </MenuItem>
              ))
            ) : (
              options.map(item => (
                <MenuItem
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </MenuItem>
              ))
            )}
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
            className={classes.switch}
            label={label}
            checked={Boolean(value)}
            onChange={ (event, value) => 
              this.props.handleFormFieldChange(id, value)
            }
          />
        )

      case 'list':
        return (
          relationId ? (
            <Paper elevation={4} className={classes.list}>
              <CategoryList
                relationMode={true}
                categoryId={relationId}
                categoryLabel={label}
                settings={relationSettings}
                items={relationItems}
                fields={relationFields}
                loading={relationLoading}
                showAvatar={false}
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
        )

      default: 
        return (
          <TextField
            className={classes.textField}
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
  options: PropTypes.array,
  relationId: PropTypes.string,
  value: PropTypes.any,
  handleFormFieldChange: PropTypes.func,
  itemsSelect: (props, propName, componentName) => {
    if (props.type === 'select' && !props.options && !props.relationId) {
      return new Error(
        `${propName} ${componentName}: Select field must to have an array of options or a relation name.`
      );
    }
  },
  optionsId: (props, propName, componentName) => {
    for (const option of props.options || []) {
      if (!option.id) {
        return new Error(
          `${propName} ${componentName}: Not option id provided on select/list field.`
        );
      }
    }
  },
  valueSelectRelation: (props, propName, componentName) => {
    if (props.relationId && props.type === 'select' && props.value && typeof props.value !== 'string') {
      return new Error(
        `${propName} ${componentName}: Value of relation field must be an id key`
      );
    }
  },
  valueListRelation: (props, propName, componentName) => {
    if (props.relationId && props.type === 'list' && props.value && typeof props.value !== 'object') {
      return new Error(
        `${propName} ${componentName}: Value of relation field must be an id key`
      );
    }
  },
};

Field.defaultProps = {
  type: 'string',
};

export default withStyles(styles)(Field);
