import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { fetchItemIfNeeded } from '../../../actions/items'
import { notify, changeActiveOpenRelation, changeOpenRelation, removeOpenRelation, closeRelations } from '../../../actions/interactions'
import { getItemString } from '../utils/helpers'
import StandardView from './standardView'
import TabsView from './tabsView'
import NotFound from '../../notFound'

class CategoryItemDetail extends Component {
  state = {
    /**
     * oneOf(['info', 'edit'])
     */
    access: 'info'
  }

  componentWillMount = () => {
    const { fetchItemIfNeeded, history } = this.props
    const historyState = history ? history.location.state : {}
    fetchItemIfNeeded() //this.props.fetchItem()
    if (historyState) {
      this.changeAccess(historyState.access || 'info')
    }
  }

  getTitle = () => {
    const { categoryPrimaryFields, item } = this.props
    return getItemString(item, categoryPrimaryFields)
  }

  getCurrentState = () => {
    const { categoryStates, item } = this.props
    const statesList = categoryStates ? categoryStates.list : null
    if (statesList && item && item.state) {
      return statesList[item.state]
    }
    return null
  }

  changeAccess = access => {
    this.setState({access})
  }

  changeCurrentRelation = newProps => {
    const { changeOpenRelation, openRelations } = this.props
    const activeIndex = openRelations.activeIndex
    const relation = openRelations.list[activeIndex]
    changeOpenRelation(activeIndex, {...relation, ...newProps})
  }

  render = () => {
    const { categoryStates, mode, item } = this.props 
    const { access } = this.state

    if (!item) {
      return <NotFound text="Item Not Found" />
    }

    const commonProps = {
      ...this.props,
      access,
      changeAccess: this.changeAccess,
      changeCurrentRelation: this.changeCurrentRelation,
      title: this.getTitle(),
      itemState: this.getCurrentState(),
      isReadonly: categoryStates && categoryStates.readonly.includes(item.state)
    }

    if (mode === 'normal') {
      return <StandardView {...commonProps} />
    } else if (mode === 'tabs') {
      return <TabsView {...commonProps} />
    } else if (mode === 'temporal') {
      return <StandardView {...commonProps} />
    }

  }
}

CategoryItemDetail.propTypes = {
  /**
   * Item mode. 'Normal' mode indicates list belongs to the main category, so it's shown
   * in a standard view.
   */
  mode: PropTypes.oneOf(['normal','tabs','temporal']).isRequired,
  /**
   * Category id of the item.
   */
  categoryId: PropTypes.string.isRequired,
  /**
   * Id of current item.
   */
  itemId: PropTypes.string.isRequired,
  onUpdateItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func,
  getNextStatesAsOperations: PropTypes.func.isRequired,

  fields: PropTypes.array.isRequired,
  openRelations: PropTypes.object.isRequired

}

CategoryItemDetail.defaultProps = {
  
}

const mapStateToProps = ({ categories, settings, fields, items, interactions, app }, props) => {
  const { categoryId, itemId } = props
  const { openRelations } = interactions
  const category = categories.byId[categoryId]
  const categorySettings = category.settings ? settings.byId[category.settings] : {}
  const itemLabel = categorySettings.itemLabel || 'Item'
  return {
    itemId,
    categoriesPath: app.categoriesPath,
    itemLabel,
    categoryPrimaryFields: categorySettings.primaryFields,
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
    openRelations,
    windowSize: interactions.windowSize
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const { categoryId, itemId } = props
  return {
    fetchItemIfNeeded: () => dispatch(fetchItemIfNeeded(categoryId, itemId)),
    notify: (message, type) => dispatch(notify(message, type)),
    changeActiveOpenRelation: index => dispatch(changeActiveOpenRelation(index)),
    changeOpenRelation: (index, values) => dispatch(changeOpenRelation(index, values)),
    removeOpenRelation: index => dispatch(removeOpenRelation(index)),
    closeRelations: () => dispatch(closeRelations())
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CategoryItemDetail)
)
