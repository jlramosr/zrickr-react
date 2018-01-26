/*eslint-disable no-eval*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { createItem, updateItem, removeItem } from '../../actions/items'
import { fetchCategoriesIfNeeded } from '../../actions/categories'
import { fetchSettings, fetchSettingsIfNeeded } from '../../actions/settings'
import { fetchFields, fetchFieldsIfNeeded } from '../../actions/fields'
import { notify } from '../../actions/interactions'
import { capitalize } from '../../utils/helpers'
import ConfirmationDialog from '../dialog/confirmation'
import NotFound from '../notFound'

class Category extends Component {
  initialState = {
    activeItem: {
      id: null,
      categoryId: null,
      title: '',
      values: null,
      action: '',
      showDialog: false
    }
  }

  state = this.initialState

  componentWillMount = () => {
    this.props.fetchCategoriesIfNeeded()
    //this.props.fetchSettings()
    this.props.fetchSettingsIfNeeded()
    //this.props.fetchFields()
    this.props.fetchFieldsIfNeeded()
  }

  componentDidUpdate = prevProps => {
    /* If multi-user */
    const prevPath = prevProps.location.pathname
    const currentPath = this.props.location.pathname
    if (prevPath !== currentPath) {
      this.props.fetchSettingsIfNeeded()
      this.props.fetchFieldsIfNeeded()
    }
  }

  onCreateItem = (categoryId, values, itemTitle=null) => {
    const { createItem, notify, categoryItemLabel,history } = this.props
    const infoItem = itemTitle ? itemTitle : capitalize(categoryItemLabel)
    return createItem(categoryId, values).then(
      itemId => {
        if (history.location.pathname === `/${categoryId}`) {
          history.push(`/${categoryId}/${itemId}`)
        }
        notify(`${infoItem} created succesfully`,'success')
      },
      error => {
        notify(`Error creating ${infoItem}: ${error}`,'error')
      }
    )
  }

  /*onUpdateItem = (categoryId, itemId, values, itemTitle=null) => {
    this.setState({
      action: 'update',
      activeCategoryId: categoryId,
      activeItem: values,
      activeItemId: itemId,
      activeItemTitle: itemTitle
    })
  }*/

  onUpdateItem = (categoryId, itemId, values, itemTitle=null, itemAction=null) => {
    const { updateItem, categoryItemLabel, notify } = this.props
    const infoItem = itemTitle ? itemTitle : capitalize(categoryItemLabel)
    return updateItem(categoryId, itemId, values).then(
      () => {
        const action = itemAction ? itemAction : 'updated'
        notify(`${infoItem} ${action} succesfully`, 'success')
      },
      error => {
        notify(`Error updating ${infoItem}: ${error}`, 'error')
      }
    )
  }

  onRemoveItem = (itemId, itemTitle=null) => {
    const activeItem = {
      id: itemId,
      title: itemTitle,
      action: 'remove',
      showDialog: true
    }
    this.setState({activeItem})
  }

  removeItem = () => {
    const { categoryItemLabel, removeItem, notify, match, history } = this.props
    const { activeItem } = this.state
    const { title, id } = activeItem
    const categoryId = match.params.categoryId
    const infoItem = title ? title : capitalize(categoryItemLabel)
    return removeItem(id).then(
      () => {
        if (history.location.pathname !== `/${categoryId}`) {
          history.push(`/${categoryId}`)
        }
        notify(`${infoItem} removed succesfully`, 'success')
      },
      error => {
        notify(`Error removing ${infoItem}: ${error}`, 'error')
      }
    )
  }

  /* It Transforms an array of states on array to put into a menu */ 
  getNextStatesAsOperations = ({ itemId, itemValues, categoryStates, onSelected, ...rest }) => {
    const currentStateId = itemValues ? itemValues.state : null
    const statesList = categoryStates ? categoryStates.list : null
    let currentState = null
    let nextIds = []
    if (statesList) {
      currentState = currentStateId ? statesList[currentStateId] : null
      if (!itemId || !currentState) {
        nextIds = Object.keys(statesList).filter(id => 
          statesList[id].initial && id !== currentStateId
        )
      } else {
        nextIds = currentState && currentState.nexts ? currentState.nexts : []
      }
    }

    let nextStates = nextIds.map(id => ({id, ...statesList[id]}))
    const addWithoutState =
      categoryStates &&
      categoryStates.required === false &&
      currentState
    if (addWithoutState) {
      nextStates = [...nextStates, {
        label: 'Liberado',
        actionLabel: 'Sin estado',
        icon: 'undo'
      }] 
    }

    return nextStates.map(nextState => {
      const { label, actionLabel, icon } = nextState
      return {id:label, icon, label:actionLabel, onClick:() => {
        if (itemId) {
          this.changeState({
            itemValues,
            currentState,
            newState: nextState,
            itemId,
            ...rest
          })
        }
        if (onSelected) {
          onSelected(nextState.id ? nextState : null)
        }
      }}
    })
  }

  /*jslint evil: true */
  changeState = ({ categoryId, itemId, itemValues, currentState, newState, itemTitle }) => {
    if (newState) {
      const newValues = {
        ...itemValues,
        state: newState.id
      }
      if (!newState.id) {
        delete newValues.state
      }
      if (currentState && currentState.onExit) {
        const actions = currentState.onExit.split(';')
        actions.forEach(action => eval(action.replace('[','newValues[')))
      }
      if (newState.onEnter) {
        const actions = newState.onEnter.split(';')
        actions.forEach(action => eval(action.replace('[','newValues[')))
      }
      this.onUpdateItem(
        categoryId,
        itemId,
        newValues,
        itemTitle,
        newState.label.toLowerCase()
      )
    }
  }

  render = () => {
    const { categories, categoriesReceived, match, route } = this.props
    const { activeItem } = this.state
    const categoryId = match.params.categoryId
    const category = categories.find(category => category.id === categoryId)

    if (!categoriesReceived) {
      return <NotFound text="Loading Categories ..." />
    }

    if (!category) {
      return <NotFound text="Category Not Found" />
    }
    
    return (
      <React.Fragment key={categoryId}> 
        {renderRoutes(route.routes, {
          categoryId,
          categoryLabel: category.label,
          onCreateItem: this.onCreateItem,
          onUpdateItem: this.onUpdateItem,
          onRemoveItem: this.onRemoveItem,
          getNextStatesAsOperations: this.getNextStatesAsOperations
        })}

        <ConfirmationDialog
          open={activeItem.showDialog}
          message={`Are you sure to want to remove ${activeItem.title}?`}
          onAccept={() => {
            this.removeItem()
          }}
          onClose={() => {
            this.setState(this.initialState)
          }}
        />
      </React.Fragment>
    )
  }
}

Category.propTypes = {
  categories: PropTypes.array.isRequired,
  categoriesReceived: PropTypes.bool.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  fetchFields: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryId: PropTypes.string.isRequired
    })
  }),
  route: PropTypes.object.isRequired
}

const mapStateToProps = ({ categories, settings }, props) => {
  const categoryId = props.match.params.categoryId
  const category = categories.byId[categoryId]
  const categorySettings = category && category.settings ? settings.byId[category.settings] : {}
  const categoryItemLabel = categorySettings.itemLabel || ''
  return {
    categories: Object.values(categories.byId),
    categoriesReceived: categories.flow.isReceivedAll,
    categoryItemLabel
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryIdFromRoute = props.match.params.categoryId
  return {
    notify: (message, type) => dispatch(notify(message, type)),
    createItem: (categoryId, values) => dispatch(createItem(categoryId, values)),
    updateItem: (categoryId, itemId, values) => dispatch(updateItem(categoryId, itemId, values)),
    removeItem: itemId => dispatch(removeItem(categoryIdFromRoute,itemId)),
    fetchCategoriesIfNeeded: () => dispatch(fetchCategoriesIfNeeded()),
    fetchSettings: () => dispatch(fetchSettings(categoryIdFromRoute)),
    fetchSettingsIfNeeded: () => dispatch(fetchSettingsIfNeeded(categoryIdFromRoute)),
    fetchFields: () => dispatch(fetchFields(categoryIdFromRoute)),
    fetchFieldsIfNeeded: () => dispatch(fetchFieldsIfNeeded(categoryIdFromRoute))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)