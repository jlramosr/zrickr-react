/*eslint-disable no-eval*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import Field from './field';
import { withStyles } from 'material-ui/styles';

class Item {
  constructor(item) {
    Object.assign(this, item);
  }

  /*jslint evil: true */
  evalCondition = (condition, fieldId) => {
    let fulfilledCondition = false;
    try {
      fulfilledCondition = eval(condition);
    }
    catch (e) {
      if (e instanceof EvalError || e instanceof SyntaxError) {
        console.warn(
          `${e.name} evaluating "${fieldId}" field showing condition: ${e.message} "${condition}"`
        );
      }
    }
    return fulfilledCondition;
  }
}

const formContainerStyles = {
  formContainer: (cols) => ({
    padding: '20px',
    display: 'grid',
    gridAutoFlow: 'row',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridGap: '0px 0px',
    justifyContent: 'stretch',
    alignItems: 'center'
  }),

  formField: (item, fieldView, fieldId, cols) => {
    if (!item) {
      return {};
    }
    if (fieldView.when && item.evalCondition(fieldView.when, fieldId)) {
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

class FormContainer extends Component {
  state = {
    item: null,
  }

  _getFieldLabel = (label, fieldView) => fieldView.nolabel ? ' ' : label;
  
  _getFieldDescription = (description, fieldView) => 
    fieldView.nodescription ? '' : description || '';

  _getFieldValue = (field) =>
    this.state.item && field.id ? this.state.item[field.id] : '';

  _handleSubmit = event => {
    console.log("SUBMIT", this.state.item);
    event.preventDefault();
  }

  handleFieldChange = (fieldId, value) => {
    this.setState(prevState => {
      let item = prevState.item;
      item[fieldId] = value;
      return item;
    })
  }

  componentWillReceiveProps = props => {
    const { fields, values } = props;
    let item = new Item(values)
    for (const field of fields) {
      if (field.default && !(field.id in values)) {
        item[field.id] = field.default;
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
        style={formContainerStyles.formContainer(cols)}
      >
        {
          fields.map(field => {
            let fieldView = field.views ? field.views[view] : null;
            if (fieldView && size in fieldView) {
              fieldView = fieldView[size];
            }

            let categoryId, categoryItems, categorySettings, categoryFields;
            if (field.relation) {
              categoryId = field.relation;
              categorySettings = {}
                //require(`../../categories/${capitalize(categoryName)}settings`).default;
              categoryItems = []
                //require(`../../categories/${capitalize(categoryName)}items`).default;
                  /*.filter(item => value.includes(item.id))*/
              categoryFields = []
                //require(`../../categories/${capitalize(categoryName)}fields`).default;
            }

            return (
              fieldView &&
                <div
                  key={field.id}
                  style={formContainerStyles.formField(item, fieldView, field.id, cols)}
                >
                  <Field
                    id={field.id}
                    type={field.type}
                    label={this._getFieldLabel(field.label, fieldView)}
                    description={this._getFieldDescription(field.description, fieldView)}
                    required={field.required}
                    value={item ? item[field.id] : ''}
                    categoryId={categoryId}
                    categoryLabel={categoryId}
                    categorySettings={categorySettings}
                    categoryFields={categoryFields}
                    items={categoryItems || field.items}
                    handleFormFieldChange={ (fieldId, value) => 
                      this.handleFieldChange(fieldId, value)
                    }
                  />
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
};

const formStyles = theme => {

};

const Form = props => {
  const { view, cols, fields, values } = props;
  const size = 'large';
  return (
    <FormContainer size={size} view={view} cols={cols} fields={fields} values={values}/>
  );
  /*return (
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
  );*/
};

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  cols: PropTypes.number,
  view: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired
}

Form.defaultProps = {
  cols: 10
}

export default withStyles(formStyles)(Form);

