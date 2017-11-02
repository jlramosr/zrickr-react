import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../../utils/api'
import HeaderLayout from '../headerLayout'
import Form from '../form'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import Delete from 'material-ui-icons/Delete'
import { getInfo } from '../../utils/helpers'

class CategoryItemDetail extends Component {
  state = {
    item: {},
    editMode: false,
    loading: true
  }

  _updateItem = () => {
    console.log('UPDATE ITEM', this.state.item)
    this._changeEditMode(false)
  }

  _deleteItem = () => {
    console.log('DELETE ITEM', this.state.item)
    /*TODO:
      return to list
    */
  }

  _changeEditMode = editMode => {
    console.log('EDIT MODE', editMode)
    this.setState({editMode})
  }

  _getData = () => {
    const { id, categoryId } = this.props
    API('local').getDocument('categories_items', categoryId, id).then(item => {
      this.setState({item, loading: false})
    }).catch(error => {
      console.log('ERROR PIDIENDO ITEM DETAIL', error)
    })
  }

  componentDidMount = () => {
    this._getData()
  }

  render = () => {
    const { categoryId, settings, fields, dialog, closeDialog } = this.props
    const { item, editMode, loading } = this.state
    return (
      <HeaderLayout
        relative={dialog}
        title={item ? getInfo(settings.primaryFields, item) : ''}
        loading={loading}
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
  id: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  dialog: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func,
  closeDialogRequired: (props, propName, componentName) => {
    if (props.dialog && !props.closeDialog) {
      return new Error(
        `${propName} ${componentName}: An detail dialog must be a closeDialog function.`
      )
    }
  }
}

CategoryItemDetail.defaultProps = {
  dialog: false
}

export default CategoryItemDetail
