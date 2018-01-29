/*eslint-disable no-eval*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import CategoryList from './list'
import CategoryItemDetail from './detail'
import CategoryItemNew from './new'
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
    /*const prevPath = prevProps.location.pathname
    const currentPath = this.props.location.pathname
    if (prevPath !== currentPath) {
      this.props.fetchSettingsIfNeeded()
      this.props.fetchFieldsIfNeeded()
    }*/
  }

  onCreateItem = (values, itemTitle=null) => {
    const { categoriesPath, categoryId, createItem, notify, categoryItemLabel, history } = this.props
    const infoItem = itemTitle ? itemTitle : categoryItemLabel
    return createItem(categoryId, values).then(
      itemId => {
        if (history.location.pathname === `/${categoryId}`) {
          history.push(`/${categoriesPath}/${categoryId}/${itemId}`)
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

  onUpdateItem = (itemId, values, itemTitle=null, itemAction=null) => {
    const { categoryId, updateItem, categoryItemLabel, notify } = this.props
    const infoItem = itemTitle ? itemTitle : categoryItemLabel
    console.log(categoryId, itemId, values);
    console.log(categoryId, itemId, values);
    return updateItem(itemId, values).then(
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
    const infoItem = title ? title : categoryItemLabel
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
  getNextStatesAsOperations = ({ itemId, itemValues, onSelected, ...rest }) => {
    const { categoryStates } = this.props
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
        actionLabel: 'Reiniciar',
        icon: 'undo'
      }] 
    }

    return nextStates.map(nextState => {
      const { label, actionLabel, icon } = nextState
      return {id:label, icon, label:itemId ? actionLabel : label, onClick:() => {
        if (itemId) {
          this.changeState({
            itemId,
            itemValues,
            currentState,
            newState: nextState,
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
  changeState = ({ itemId, itemValues, currentState, newState, itemTitle }) => {
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
        itemId,
        newValues,
        itemTitle,
        newState.label.toLowerCase()
      )
    }
  }

  render = () => {
    const {
      categoriesReceived,
      categoryId,
      category,
      itemId,
      itemIds,
      title,
      mode,
      editable,
      onChange
    } = this.props
    const { activeItem } = this.state

    const scene = this.props.scene || (itemId ? 'detail' : 'list')

    if (!categoriesReceived) {
      return <NotFound text="Loading Categories ..." />
    }

    if (!category) {
      return <NotFound text="Category Not Found" />
    }

    if (scene === 'list') {
      const commonListProps = {
        categoryId,
        itemIds,
        onUpdateItem: this.onUpdateItem,
        onRemoveItem: this.onRemoveItem,
        getNextStatesAsOperations: this.getNextStatesAsOperations
      }
      switch (mode) {
        case 'relation': 
          return <CategoryList {...commonListProps} relationMode title={title} editable={editable} onChange={onChange} />
        case 'selection':
          return <CategoryList {...commonListProps} dialogMode />
        default:
          return <CategoryList {...commonListProps} showAvatar editable />
      }
    }

    if (scene === 'detail') {
      return (
        <CategoryItemDetail
          categoryId={categoryId}
          itemId={itemId}
          getNextStatesAsOperations={this.getNextStatesAsOperations}
        />
      )
    }

    if (scene === 'new') {
      return (
        <CategoryItemNew
          categoryId={categoryId}
          onCreateItem={this.onCreateItem}
          getNextStatesAsOperations={this.getNextStatesAsOperations}
        />
      )
    }
    
    return (
      <React.Fragment key={categoryId}> 
        <div>hola {this.props.itemId}</div>

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

  categoryId: PropTypes.string.isRequired,
  itemId: PropTypes.string,
  scene: PropTypes.string,
  mode: PropTypes.string,
  editable: PropTypes.bool,
  showAvatar: PropTypes.bool,

  categories: PropTypes.array.isRequired,
  categoriesReceived: PropTypes.bool.isRequired,
  category: PropTypes.object,
  categoryItemLabel: PropTypes.string,
  fetchSettings: PropTypes.func.isRequired,
  fetchFields: PropTypes.func.isRequired

}

Category.defaultProps = {
  mode: 'normal',
  editable: false,
  showAvatar: false
}

const mapStateToProps = ({ categories, settings, app }, props) => {
  const categoryId = props.categoryId || props.match.params.categoryId
  const itemId = props.itemId || props.match ? props.match.params.itemId : undefined
  const category = categories.byId[categoryId]
  const categorySettings = category && category.settings ? settings.byId[category.settings] : {}
  const itemLabel = categorySettings.itemLabel || ''
  const categoryItemLabel = capitalize(itemLabel)
  return {
    categories: Object.values(categories.byId),
    categoriesPath: app.categoriesPath,
    categoriesReceived: categories.flow.isReceivedAll,
    categoryId,
    categoryStates: categorySettings.states,
    category,
    categoryItemLabel,
    itemId
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.categoryId || props.match.params.categoryId
  return {
    notify: (message, type) => dispatch(notify(message, type)),
    createItem: values => dispatch(createItem(categoryId, values)),
    updateItem: (itemId, values) => dispatch(updateItem(categoryId, itemId, values)),
    removeItem: itemId => dispatch(removeItem(categoryId, itemId)),
    fetchCategoriesIfNeeded: () => dispatch(fetchCategoriesIfNeeded()),
    fetchSettings: () => dispatch(fetchSettings(categoryId)),
    fetchSettingsIfNeeded: () => dispatch(fetchSettingsIfNeeded(categoryId)),
    fetchFields: () => dispatch(fetchFields(categoryId)),
    fetchFieldsIfNeeded: () => dispatch(fetchFieldsIfNeeded(categoryId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)