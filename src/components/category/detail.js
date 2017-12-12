import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HeaderLayout from '../headerLayout'
import { fetchItemIfNeeded } from '../../actions/items'
import Form from '../form'
import { notify } from '../../actions/notifier'
import { updateItem, removeItem } from '../../actions/items'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
import Delete from 'material-ui-icons/Delete'
import { getItemInfo } from './utils/helpers'
import { capitalize, isEqual } from '../../utils/helpers'
import NotFound from '../notFound'

class CategoryItemDetail extends Component {
  state = {
    editMode: false
  }

  _changeEditMode = editMode => {
    this.setState({editMode})
  }

  _updateItem = values => {
    const { settings, updateItem, notify } = this.props
    if (!isEqual(this.props.item, values)) {
      return updateItem(values).then(
        () => {
          notify(
            `${capitalize(settings.itemLabel)} updated succesfully`,
            'success'
          )
          this._changeEditMode(false)
        }, error => {
          notify(
            `There has been an error updating the ${settings.itemLabel.toLowerCase()}: ${error}`,
            'error'
          )
        }
      )
    }
    notify(
      `There has been no change updating this ${settings.itemLabel}`,
      'info'
    )
    this._changeEditMode(false)
    return new Promise(resolve => resolve())
  }

  _removeItem = () => {
    const { categoryId, settings, removeItem, notify, history } = this.props
    return removeItem().then(
      () => {
        notify(
          `${capitalize(settings.itemLabel)} removed succesfully`,
          'success'
        )
        history.push(`/${categoryId}`)
      }, error => {
        notify(
          `There has been an error removing the ${settings.itemLabel.toLowerCase()}: ${error}`,
          'error'
        )
      }
    )
  }

  componentWillUnmount = () => {
    //console.log('DETAIL UNMOUNTED')
  }

  componentWillMount = () => {
    //console.log('DETAIL MOUNTED')
    this.props.fetchItemIfNeeded() //this.props.fetchItem()
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
      isUpdating,
      dialogMode,
      relationMode,
      closeDialog
    } = this.props
    const { editMode } = this.state

    return (
      //itemReceived ? (
      item ? (
        <HeaderLayout
          relative={relationMode}
          title={item ? getItemInfo(settings.primaryFields, item) : ''}
          loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
          operations={[
            {id:'arrowBack', icon:ArrowBack, hidden:dialogMode, to:`/${categoryId}`},
            {id:'close', icon:Close, hidden:!dialogMode, onClick:closeDialog},
            {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => this._changeEditMode(true)},
            {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => this._changeEditMode(false)},
            {id:'delete', icon:Delete, right:true, hidden:editMode || dialogMode, onClick:this._removeItem},
            {id:'check', icon:Check, right:true, hidden:!editMode, onClick: () => {
              this.formElement.dispatchEvent(new Event('submit'))
            }}
          ]}
        >
          <Form
            cols={12}
            view="detail"
            infoMode={!editMode}
            fields={fields}
            values={item}
            handleSubmit={this._updateItem}
            formRef={el => this.formElement = el}
          />
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
    if (props.dialogMode) {
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
    if (props.dialogMode) {
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
  dialogMode: false
}

const mapStateToProps = ({ categories, settings, fields, items }, props) => {
  const categoryId = props.categoryId
  const itemId = props.dialogMode ? props.itemId : props.match.params.itemId
  const category = categories.byId[categoryId]
  return { 
    settings: category.settings ? settings.byId[category.settings] : {},
    isFetchingSettings: settings.flow[categoryId].isFetching,
    fields: Object.values(fields.byId).filter(
      field => category.fields && category.fields.includes(field.id)
    ),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    item: category.items && category.items.includes(itemId) ? items.byId[itemId] : null,
    isFetchingItem: items.flow[categoryId].isFetchingItem,
    //itemReceived: items.flow[categoryId].isReceivedItem || items.flow[categoryId].errorFetchingItem
    isUpdating: items.flow[categoryId].isUpdating
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.categoryId
  const itemId = props.dialogMode ? props.itemId : props.match.params.itemId
  return {
    fetchItemIfNeeded: () => dispatch(fetchItemIfNeeded(categoryId,itemId)),
    updateItem: item => dispatch(updateItem(props.categoryId, itemId, item)),
    removeItem: () => dispatch(removeItem(categoryId,itemId)),
    notify: (message, type) => dispatch(notify(message, type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItemDetail)
