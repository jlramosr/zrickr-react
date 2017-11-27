import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HeaderLayout from '../headerLayout'
import { fetchItem } from '../../actions/items'
import Form from '../form'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import Delete from 'material-ui-icons/Delete'
import { getItemInfo } from './utils/helpers'
import NotFound from '../notFound'

class CategoryItemDetail extends Component {
  state = {
    editMode: false
  }

  componentWillUnmount = () => {
    //console.log('DETAIL UNMOUNTED')
  }

  componentWillMount = () => {
    //console.log('DETAIL MOUNTED')
    this.props.fetchItem()
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

  render = () => {
    const {
      categoryId,
      settings,
      isFetchingSettings,
      fields,
      isFetchingFields,
      item,
      isFetchingItem,
      //itemReceived,
      dialog,
      closeDialog
    } = this.props
    const { editMode } = this.state
    return (
      //itemReceived ? (
      item ? (
        <HeaderLayout
          relative={dialog}
          title={item ? getItemInfo(settings.primaryFields, item) : ''}
          loading={isFetchingSettings || isFetchingFields || isFetchingItem }
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
      ) : (
        <NotFound text="Item Not Found" />
      )
      //) : (
      //  <NotFound text="Loading Item ..." />
      //)
    )
  }
}

CategoryItemDetail.propTypes = {
  categoryId: PropTypes.string.isRequired,
  dialog: PropTypes.bool,
  itemId: (props, propName, componentName) => {
    if (props.dialog) {
      if (!props.itemId) {
        return new Error(
          `The prop ${propName} is marked as required in ${componentName} when this component is shown in a dialog, but its value is ${props.itemId}`
        )
      }
      if (typeof props.itemId !== 'string') {
        return new Error(
          `Invalid prop ${propName} of type ${typeof props.itemId} supplied to ${componentName}, expected 'string'`
        )
      }
    }
  },
  settings: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  closeDialog: (props, propName, componentName) => {
    if (props.dialog) {
      if (!props.closeDialog) {
        return new Error(
          `The prop ${propName} is marked as required in ${componentName} when this component is shown in a dialog, but its value is ${props.closeDialog}`
        )
      }
      if (typeof props.closeDialog !== 'function') {
        return new Error(
          `Invalid prop ${propName} of type ${typeof props.closeDialog} supplied to ${componentName}, expected 'function'`
        )
      }
    }
  }
}

CategoryItemDetail.defaultProps = {
  dialog: false
}

const mapStateToProps = ({ categories, settings, fields, items }, props) => {
  const categoryId = props.categoryId
  const itemId = props.dialog ? props.itemId : props.match.params.itemId
  const category = categories.byId[categoryId]
  return { 
    settings: category.settings ? settings.byId[category.settings] : {},
    isFetchingSettings: settings.flow[categoryId].isFetching,
    fields: Object.values(fields.byId).filter(
      field => category.fields && category.fields.includes(field.id)
    ),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    item: category.items && category.items.includes(itemId) ? items.byId[itemId] : null,
    isFetchingItem: items.flow[categoryId].isFetchingItem
    //itemReceived: items.flow[categoryId].isReceivedItem || items.flow[categoryId].errorFetchingItem
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.categoryId
  const itemId = props.dialog ? props.itemId : props.match.params.itemId
  return {
    fetchItem: () => dispatch(fetchItem(categoryId,itemId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItemDetail)
