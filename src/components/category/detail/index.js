import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchItemIfNeeded, updateItem } from '../../../actions/items'
import { notify, removeOpenRelation, removeAllOpenRelations,closeRelations } from '../../../actions/interactions'
import { getItemString } from '../utils/helpers'
import { capitalize, isEqual } from '../../../utils/helpers'
import StandardView from './standardView'
import TabsView from './tabsView'
import NotFound from '../../notFound'

class CategoryItemDetail extends Component {
  state = {
    editMode: false
  }

  componentWillMount = () => {
    const { fetchItemIfNeeded, history } = this.props
    const historyState = history ? history.location.state : {}
    fetchItemIfNeeded() //this.props.fetchItem()
    if (historyState && historyState.editMode) {
      this.changeEditMode(true)
    }
  }

  getTitle = () => {
    const { categoryPrimaryFields, item } = this.props
    return item ? getItemString(item, categoryPrimaryFields) : ''
  }

  getState = () => {
    const { categoryStates, item } = this.props
    if (categoryStates && item && item.state) {
      return categoryStates[item.state]
    }
    return {}
  }

  getNextStates = () => {
    const { categoryStates, item } = this.props
    if (categoryStates && item && item.state) {
      const nextIds = categoryStates[item.state].nexts
      return nextIds.map(id => categoryStates[id])
    }
    return []
  }

  changeEditMode = editMode => {
    this.setState({editMode})
  }

  updateItem = values => {
    const { item, categoryItemLabel, updateItem, notify } = this.props
    if (!isEqual(item, values)) {
      return updateItem(values).then(
        () => {
          notify(`${capitalize(categoryItemLabel)} updated succesfully`, 'success')
          this.changeEditMode(false)
        }, error => {
          notify(`There has been an error updating the ${categoryItemLabel.toLowerCase()}: ${error}`, 'error')
        }
      )
    }
    notify(`There has been no change updating this ${categoryItemLabel}`, 'info')
    this.changeEditMode(false)
    return new Promise(resolve => resolve())
  }

  render = () => {
    const { editMode } = this.state
    const commonProps = {
      ...this.props,
      editMode,
      title: this.getTitle(),
      itemState: this.getState(),
      getNextStates: () => this.getNextStates(),
      updateItem: this.updateItem,
      changeEditMode: this.changeEditMode
    }

    if (!this.props.item) {
      return <NotFound text="Item Not Found" />
    }

    if (this.props.dialogMode) {
      return <TabsView {...commonProps} />
    }

    return <StandardView {...commonProps} />
  }
}

CategoryItemDetail.propTypes = {
  /**
   * If it's shown in a dialog.
   */
  dialogMode: PropTypes.bool,
  /**
   * Category id of the item in case of detail item is not shown in a tab of a dialog.
   */
  categoryId: PropTypes.string,
  /**
   * Category id of the item in case of detail item is shown in in a tab of a dialog.
   */
  activeCategoryId: PropTypes.string,
  /**
   * Item id if it's shown in a dialog (if not, itemId will be caught from route).
   */
  activeItemId: PropTypes.string,
  /**
   * Fields of the category obtained from Redux Store.
   */
  fields: PropTypes.array.isRequired,
  openRelations: PropTypes.array.isRequired
}

CategoryItemDetail.defaultProps = {
  dialogMode: false
}

const mapStateToProps = ({ categories, settings, fields, items, interactions }, props) => {
  const categoryId = props.dialogMode ? props.activeCategoryId : props.categoryId
  const itemId = props.dialogMode ? props.activeItemId : props.match.params.itemId
  const category = categories.byId[categoryId]
  const categorySettings = category.settings ? settings.byId[category.settings] : {}
  const { relations } = interactions
  return {
    itemId,
    categoryPrimaryFields: categorySettings.primaryFields,
    categoryItemLabel: categorySettings.itemLabel,
    categoryStates: categorySettings.states,
    isFetchingSettings: settings.flow[categoryId].isFetching,
    fields: Object.values(fields.byId).filter(
      field => category.fields && category.fields.includes(field.id)
    ),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    item: category.items && category.items.includes(itemId) ? items.byId[itemId] : null,
    isFetchingItem: items.flow[categoryId].isFetchingItem,
    //itemReceived: items.flow[categoryId].isReceivedItem || items.flow[categoryId].errorFetchingItem
    isUpdating: items.flow[categoryId].isUpdating,
    openRelations: relations.openRelations,
    shouldShowRelations: relations.isShowing,
    repeatedIndex: relations.repeatedIndex,
    windowSize: interactions.windowSize
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.dialogMode ? props.activeCategoryId : props.categoryId
  const itemId = props.dialogMode ? props.activeItemId : props.match.params.itemId
  return {
    fetchItemIfNeeded: () => dispatch(fetchItemIfNeeded(categoryId,itemId)),
    updateItem: item => dispatch(updateItem(props.categoryId, itemId, item)),
    notify: (message, type) => dispatch(notify(message, type)),
    removeOpenRelation: index => dispatch(removeOpenRelation(index)),
    removeAllOpenRelations: () => dispatch(removeAllOpenRelations()),
    closeRelations: () => dispatch(closeRelations())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItemDetail)
