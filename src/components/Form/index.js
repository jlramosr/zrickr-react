/*eslint-disable no-eval*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import Field from './field';
import { capitalize } from '../../utils/helpers';
import { withStyles } from 'material-ui/styles';

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
  evalCondition = (condition, fieldName) => {
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

class FormContainer extends Component {
  state = {
    item: null,
  }

  _getFieldLabel = (label, fieldView) => fieldView.nolabel ? ' ' : label;
  
  _getFieldDescription = (description, fieldView) => 
    fieldView.nodescription ? '' : description || '';

  _getFieldValue = (field) =>
    this.state.item && field.name ? this.state.item[field.name] : '';

  _handleSubmit = event => {
    console.log("SUBMIT", this.state.item);
    event.preventDefault();
  }

  handleFieldChange = (field, value) => {
    this.setState(prevState => {
      let item = prevState.item;
      item[field] = value;
      return item;
    })
  }

  componentDidMount = _ => {
    let item = new Item(this.props.values)
    const { fields, values } = this.props;
    for (const field of fields) {
      if (field.default && !(field.name in values)) {
        item[field.name] = field.default;
      }
    }
    this.setState({item});
  }

  render = _ => {
    const { size, view, cols, fields } = this.props;
    const { item } = this.state;

    return (
      <form 
        onSubmit={ event => this._handleSubmit(event)}
        style={styles.formContainer(cols)}
      >
        {
          fields.map(field => {
            let fieldView = field.views ? field.views[view] : null;
            if (fieldView && size in fieldView) {
              fieldView = fieldView[size];
            }

            let category, categoryName, categoryItems, categorySettings, categoryFields;
            if (field.relation) {
              categoryName = field.relation;
              category = {label: categoryName};
              categorySettings =
                require(`../../categories/${capitalize(categoryName)}settings`).default;
              categoryItems =
                require(`../../categories/${capitalize(categoryName)}items`).default;
                  /*.filter(item => value.includes(item.id))*/
              categoryFields =
                require(`../../categories/${capitalize(categoryName)}fields`).default;
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
                      description={this._getFieldDescription(field.description, fieldView)}
                      required={field.required}
                      value={item ? item[field.name] : ''}
                      category={category}
                      categorySettings={categorySettings}
                      categoryFields={categoryFields}
                      items={categoryItems || field.items}
                      handleFormFieldChange={ (fieldName, value) => 
                        this.handleFieldChange(fieldName, value)
                      }
                    />
                  }
                </div>
            )
          })
        } 
      </form>
    )
  };
};

FormContainer.propTypes = {
  cols: PropTypes.number.isRequired,
  view: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired
}

FormContainer = withStyles(styles)(FormContainer);

const Form = props => {
  const { view, cols, fields, values } = props;
  return (
    <div>
      <Media query="(max-width:700px)" render={ _ => (
        <FormContainer
          size="small"
          view={view}
          cols={cols}
          fields={fields}
          values={values}
        />
      )}/>
      <Media query="(min-width:701px) and (max-width:1224px)"  render={ _ => (
        <FormContainer
          size="medium"
          view={view}
          cols={cols}
          fields={fields}
          values={values}
        />
      )}/>
      <Media query="(min-width:1225px)"  render={ _ => (
        <FormContainer
          size="large"
          view={view}
          cols={cols}
          fields={fields}
          values={values}
        />
      )}/>
    </div>
  );
};

Form.propTypes = {
  cols: PropTypes.number,
  view: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired
}

Form.defaultProps = {
  cols: 10
}

export default Form;
