import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Form from '../form'
import { notify } from '../../actions/notifier'
import { createNewItem } from '../../actions/items'
import HeaderLayout from '../headerLayout'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'

class CategoryItemNew extends Component {
  _createItem = item => {
    this.props.createNewItem(item).then(
      () => {
        this.props.notify('Item created succesfully', 'success')
        this.props.closeDialog()
      }, error => {
        this.props.notify(`There has been an error creating the item: ${error}`, 'error')
      }
    )
  }

  render = () => {
    const { closeDialog, fields, isFetchingFields, itemLabel } = this.props

    return (
      <HeaderLayout
        title={`New ${itemLabel}`}
        loading={isFetchingFields}
        operations={[
          {id:'close', icon:Close, onClick:closeDialog},
          {id:'check', icon:Check, right: true, onClick: () => {
            const event = new Event('submit', {
              'bubbles'    : false,
              'cancelable' : false
            })
            this.formElement.dispatchEvent(event)
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

const mapStateToProps = ({ categories, fields }, props) => {
  const categoryId = props.categoryId
  const category = categories.byId[categoryId]
  return {
    fields: Object.values(fields.byId).filter(field => category.fields.includes(field.id)),
    isFetchingFields: fields.flow[categoryId].isFetchingAll
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  createNewItem: item => dispatch(createNewItem(props.categoryId, item)),
  notify: (message, type) => dispatch(notify(message, type))
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItemNew)
