import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Form from '../form'
import { notify } from '../../actions/interactions'
import { createItem } from '../../actions/items'
import HeaderLayout from '../headerLayout'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'
import { capitalize } from '../../utils/helpers'

class CategoryItemNew extends Component {

  createItem = item => {
    const { createItem, notify, closeDialog, categoryId, history } = this.props
    return createItem(item).then(
      itemId => {
        notify(
          `${capitalize(this.props.categoryItemLabel)} created succesfully`,
          'success'
        )
        if (history) {
          history.push(`${categoryId}/${itemId}`)
        }
        closeDialog()
      }, error => {
        notify(
          `There has been an error creating the ${this.props.categoryItemLabel.toLowerCase()}: ${error}`,
          'error'
        )
      }
    )
  }

  render = () => {
    const { closeDialog, fields, isFetchingFields, isCreatingItem, categoryItemLabel } = this.props
    return (
      <HeaderLayout
        title={`New ${categoryItemLabel}`}
        loading={isFetchingFields || isCreatingItem}
        operations={[
          {id:'close', icon:Close, onClick:closeDialog},
          {id:'check', icon:Check, hidden: isFetchingFields || isCreatingItem, right: true, onClick: () => {
            this.formElement.dispatchEvent(new Event('submit'))
          }}
        ]}
      >
        <Form
          cols={12}
          view="detail"
          fields={fields}
          values={{}}
          handleSubmit={this.createItem}
          formRef={el => this.formElement = el}
        />
      </HeaderLayout>
    )
  }
}

CategoryItemNew.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  isFetchingFields: PropTypes.bool,
  fields: PropTypes.array,
  categoryItemLabel: PropTypes.string,
  history: PropTypes.object
}

const mapStateToProps = ({ categories, fields, items }, props) => {
  const categoryId = props.categoryId
  const category = categories.byId[categoryId]
  return {
    fields: Object.values(fields.byId).filter(field => category.fields.includes(field.id)),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    isCreatingItem: items.flow[categoryId].isUpdating
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  createItem: item => dispatch(createItem(props.categoryId, item)),
  notify: (message, type) => dispatch(notify(message, type))
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItemNew)
