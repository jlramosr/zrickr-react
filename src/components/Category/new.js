import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Form from '../form'
import { notify } from '../../actions/notifier'
import { createNewItem } from '../../actions/items'
import HeaderLayout from '../headerLayout'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'
import { capitalize } from '../../utils/helpers'

class CategoryItemNew extends Component {

  _createItem = item => {
    const { createNewItem, notify, closeDialog } = this.props
    return createNewItem(item).then(
      () => {
        notify(
          `${capitalize(this.props.itemLabel)} created succesfully`,
          'success'
        )
        closeDialog()
      }, error => {
        notify(
          `There has been an error creating the ${this.props.itemLabel.toLowerCase()}: ${error}`,
          'error'
        )
      }
    )
  }

  render = () => {
    const { closeDialog, fields, isFetchingFields, isCreatingItem, itemLabel } = this.props
    return (
      <HeaderLayout
        title={`New ${itemLabel}`}
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
          handleSubmit={this._createItem}
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
  itemLabel: PropTypes.string
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
  createNewItem: item => dispatch(createNewItem(props.categoryId, item)),
  notify: (message, type) => dispatch(notify(message, type))
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItemNew)
