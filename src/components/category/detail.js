import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import { fetchItemIfNeeded } from '../../actions/items'
import Form from '../form'
import { notify } from '../../actions/notifier'
import { updateItem, removeItem } from '../../actions/items'
import { getItemInfo } from './utils/helpers'
import { capitalize, isEqual } from '../../utils/helpers'
import ItemHeaderLayout from './detail2'
import ItemTabsLayout from './detail3'

class CategoryItemDetail extends Component {
  state = {
    editMode: false
  }

  changeEditMode = editMode => {
    this.setState({editMode})
  }

  getTitle = () => {
    const { settings, item } = this.props
    return item ? getItemInfo(settings.primaryFields, item) : ''
  }

  updateItem = values => {
    console.log("UPDATE", this.props.dialogMod, this.props.item, values)
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

  removeItem = () => {
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

  renderForm = () => {
    const { fields, item } = this.props
    const { editMode } = this.state

    return (
      <Form
        cols={12}
        view="detail"
        infoMode={!editMode}
        fields={fields}
        values={item}
        handleSubmit={this._updateItem}
        formRef={el => this.formElement = el}
      />
    )
  }

  render = () => (
    this.props.dialogMode ? (

      <ItemTabsLayout
        editMode={this.state.editMode}
        changeEditMode={this.changeEditMode}
        title={this.getTitle()}
      >
        {this.renderForm()}
      </ItemTabsLayout>

    ) : (

      <ItemHeaderLayout
        {...this.props}
        editMode={this.state.editMode}
        changeEditMode={this.changeEditMode}
        title={this.getTitle()}
      >
        <React.Fragment>
          {this.renderForm()}
          <Dialog open={this.props.openDialogs.length}>
            <CategoryItemDetail
              dialogMode
              level={this.props.openDialogs.length}
            />
          </Dialog>
        </React.Fragment>
      </ItemHeaderLayout>

    )
  )
}

CategoryItemDetail.propTypes = {
  /**
   * Category id of the item.
   */
  categoryId: PropTypes.string.isRequired,
  /**
   * If it's shown in a dialog.
   */
  dialogMode: PropTypes.bool,
  /**
   * Item id if it's shown in a dialog (if not, itemId will be caught from route).
   */
  itemId: PropTypes.string,
  /**
   * Settings of the category obtained from Redux Store.
   */
  settings: PropTypes.object.isRequired,
  /**
   * Fields of the category obtained from Redux Store.
   */
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

const mapStateToProps = ({ categories, settings, fields, items, dialogs }, props) => {
  const openDialogs = dialogs.openDialogs
  const categoryId = props.dialogMode ? openDialogs[openDialogs.length-1].categoryId : props.categoryId
  const itemId = props.dialogMode ? openDialogs[openDialogs.length-1].itemId : props.match.params.itemId
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
    isUpdating: items.flow[categoryId].isUpdating,
    openDialogs
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.categoryId
  const itemId = props.dialogMode ? props.itemId : props.match.params.itemId
  return {
    fetchItemIfNeeded: () => dispatch(fetchItemIfNeeded(categoryId,itemId)),
    updateItem: item => dispatch(updateItem(props.categoryId, itemId, item)),
    removeItem: () => dispatch(removeItem(categoryId,itemId)),
    notify: (message, type) => dispatch(notify(message, type)),
    addOpenDialog: (categoryId, itemId) => dispatch(addOpenDialog(categoryId, itemId)),
    removeOpenDialog: () => dispatch(removeOpenDialog())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItemDetail)
