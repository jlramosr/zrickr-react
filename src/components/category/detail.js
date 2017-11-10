import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HeaderLayout from '../headerLayout'
import Form from '../form'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import Delete from 'material-ui-icons/Delete'
import { getItemInfo } from './utils/helpers'

class CategoryItemDetail extends Component {
  state = {
    editMode: false
  }

  _updateItem = () => {
    console.log('UPDATE ITEM', this.state.item)
    this._changeEditMode(false)
  }

  _deleteItem = () => {
    console.log('DELETE ITEM', this.state.item)
  }

  _changeEditMode = editMode => {
    console.log('EDIT MODE', editMode)
    this.setState({editMode})
  }

  componentDidMount = () => {
  }

  render = () => {
    const {
      categoryId,
      settings,
      isFetchingSettings,
      isFetchingFields,
      fields,
      item,
      dialog,
      closeDialog
    } = this.props
    const { editMode } = this.state
    return (
      <HeaderLayout
        relative={dialog}
        title={item ? getItemInfo(settings.primaryFields, item) : ''}
        loading={isFetchingSettings || isFetchingFields}
        operations={[
          {id:'arrowBack', icon:ArrowBack, hidden:dialog, to:`/${categoryId}`},
          {id:'close', icon:Close, hidden:!dialog, onClick:closeDialog},
          {id:'check', icon:Check, right:true, hidden:!editMode, onClick:this._updateItem},
          {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => this._changeEditMode(true)},
          {id:'delete', icon:Delete, right:true, hidden:editMode, onClick:this._deleteItem}
        ]}
      >
        <Form cols={12} view="detail" fields={fields} values={item}/>
      </HeaderLayout>
    )
  }
}

CategoryItemDetail.propTypes = {
  categoryId: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  dialog: PropTypes.bool,
  closeDialog: PropTypes.func,
  closeDialogRequired: (props, propName, componentName) => {
    if (props.dialog && !props.closeDialog) {
      return new Error(
        `${propName} ${componentName}: A detail dialog must be a closeDialog function.`
      )
    }
  }
}

const mapStateToProps = ({ settings, fields, items }, props) => {
  const itemId = props.match.params.itemId
  return { 
    settings: settings.byId[props.categorySettingsId],
    isFetchingSettings: settings.flow.isFetching,
    fields: Object.values(fields.byId).filter(
      field => props.categoryFieldsIds.includes(field.id)
    ),
    isFetchingFields: fields.flow.isFetching,
    item: props.categoryItemsIds.includes(itemId) ? items.byId[itemId] : null,
    isFetchingItems: items.flow.isFetching
  }
}

CategoryItemDetail.defaultProps = {
  dialog: false
}

export default connect(mapStateToProps, null)(CategoryItemDetail)
