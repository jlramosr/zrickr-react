/*eslint-disable no-eval*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
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
import Dialog from '../dialog/large'
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
    const { createItem, notify, itemLabel, history, mode } = this.props
    const infoItem = itemTitle ? itemTitle : itemLabel
    return createItem(values).then(
      itemId => {
        if (mode === 'normal') {
          const { categoriesPath, categoryId } = this.props
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
    const { updateItem, itemLabel, notify } = this.props
    const infoItem = itemTitle ? itemTitle : itemLabel
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
    const { itemLabel, removeItem, notify, history, mode } = this.props
    const { activeItem } = this.state
    const { title, id } = activeItem
    const infoItem = title ? title : itemLabel
    return removeItem(id).then(
      () => {
        if (mode === 'normal') {
          const { categoryId, categoriesPath } = this.props
          history.push(`/${categoriesPath}/${categoryId}`)
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

  confirmationDialog() {
    const { activeItem } = this.state
    return (
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
    )
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
      open,
      onChange,
      onSelect,
      onClose,
      onExited
    } = this.props

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
        mode,
        onUpdateItem: this.onUpdateItem,
        getNextStatesAsOperations: this.getNextStatesAsOperations
      }
      switch (mode) {
        case 'normal':
          return (
            <React.Fragment>
              <CategoryList {...commonListProps} showAvatar editable onRemoveItem={this.onRemoveItem} />
              {this.confirmationDialog()}
            </React.Fragment>
          )
        case 'relation':
          return <CategoryList {...commonListProps} title={title} editable={editable} onChange={onChange} />
        case 'election':
          return (
            <Dialog open={open} onClose={onClose}>
              <CategoryList {...commonListProps} onSelect={onSelect} closeDialog={onClose} />
            </Dialog>
          )
        default:
          return <CategoryList {...commonListProps} />
      }
    }

    if (scene === 'detail') {
      const commonDetailProps = {
        categoryId,
        itemId,
        mode,
        onUpdateItem: this.onUpdateItem,
        getNextStatesAsOperations: this.getNextStatesAsOperations
      }
      switch (mode) {
        case 'normal':
          return (
            <React.Fragment>
              <CategoryItemDetail {...commonDetailProps} onRemoveItem={this.onRemoveItem} />
              {this.confirmationDialog()}
            </React.Fragment>
          )
        case 'tabs':
          return (
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={onClose} onExited={onExited}>
              <CategoryItemDetail
                {...commonDetailProps}
                closeDialog={onClose}
              />
            </Dialog>
          )
        case 'temporal':
          return (
            <CategoryItemDetail {...commonDetailProps} closeDialog={onClose} />
          )
        default:
          return <CategoryItemDetail {...commonDetailProps} />
      }
    }

    if (scene === 'new') {
      const commonNewProps = {
        categoryId,
        onCreateItem: this.onCreateItem,
        getNextStatesAsOperations: this.getNextStatesAsOperations
      }
      return (
        <Dialog fullScreen={mode === 'normal'} open={open} onClose={onClose}>
          <CategoryItemNew {...commonNewProps} closeDialog={onClose} />
        </Dialog>
      )
    }
  }
}

Category.propTypes = {

  scene: PropTypes.oneOf(['list', 'detail', 'new']),
  mode: PropTypes.oneOf(['normal', 'relation', 'election', 'tabs', 'temporal']),
  categoryId: PropTypes.string.isRequired,
  itemId: PropTypes.string,
  itemIds: PropTypes.array,
  title: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,

  categories: PropTypes.array.isRequired,
  categoriesPath: PropTypes.string.isRequired,
  categoriesReceived: PropTypes.bool.isRequired,
  categoryStates: PropTypes.object,
  category: PropTypes.object,
  itemLabel: PropTypes.string,
  notify: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  fetchCategoriesIfNeeded: PropTypes.func.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  fetchSettingsIfNeeded: PropTypes.func.isRequired,
  fetchFields: PropTypes.func.isRequired,
  fetchFieldsIfNeeded: PropTypes.func.isRequired

}

Category.defaultProps = {
  mode: 'normal',
  editable: false
}

const mapStateToProps = ({ categories, settings, app }, props) => {
  const categoryId = props.categoryId || props.match.params.categoryId
  const itemId = props.itemId || (props.match ? props.match.params.itemId : undefined)
  const category = categories.byId[categoryId]
  const categorySettings = category && category.settings ? settings.byId[category.settings] : {}
  const itemLabel = capitalize(categorySettings.itemLabel || '')
  return {
    categories: Object.values(categories.byId),
    categoriesPath: app.categoriesPath,
    categoriesReceived: categories.flow.isReceivedAll,
    categoryId,
    categoryStates: categorySettings.states,
    category,
    itemLabel,
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Category)
)