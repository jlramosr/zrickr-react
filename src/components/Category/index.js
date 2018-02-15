/*eslint-disable no-eval*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import CategoryList from './list'
import CategoryItemDetail from './detail'
import CategoryItemNew from './new'
import { createItems, updateItems, removeItems } from '../../actions/items'
import { fetchCategoriesIfNeeded } from '../../actions/categories'
import { fetchSettings, fetchSettingsIfNeeded } from '../../actions/settings'
import { fetchFields, fetchFieldsIfNeeded } from '../../actions/fields'
import { notify } from '../../actions/interactions'
import Dialog from '../dialog/large'
import ConfirmationDialog from '../dialog/confirmation'
import NotFound from '../notFound'

class Category extends Component {
  initialState = {
    actuatedItems: {
      ids: null,
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

  onCreateItems = ({values, title=null, quantity=1, successCallback=null}) => {
    const { createItems, notify, itemLabel, history, mode } = this.props
    return createItems(values, quantity).then(
      itemId => {
        if (mode === 'normal') {
          const { categoriesPath, categoryId } = this.props
          history.push(`/${categoriesPath}/${categoryId}/${itemId}`)
        }
        if (successCallback) {
          successCallback()
        }
        notify(`${title ? title : `The ${itemLabel}`} has been created`,'success')
      },
      error => {
        notify(`Error creating ${title ? title : `the ${itemLabel}`}: ${error}`,'error')
      }
    )
  }

  onUpdateItems = ({itemIds, values, withConfirmation=false, action=null, title=null, successCallback=null}) => {
    const actuatedItems = {
      ids: itemIds,
      values,
      title,
      action,
      showDialog: withConfirmation,
      successCallback
    }
    if (withConfirmation) {
      this.setState({actuatedItems})
    } else {
      this.updateItems(actuatedItems)
    }
  }

  updateItems = (actuatedItems=this.state.actuatedItems) => {
    const { updateItems, itemLabel, notify } = this.props
    const { title, ids, action, values, successCallback } = actuatedItems

    return updateItems(ids, values).then(
      () => {
        const infoAction = action ? action : 'updated'
        if (successCallback) {
          successCallback()
        }
        notify(`${title ? title : `The ${itemLabel}`} has been ${infoAction}`, 'success')
      },
      error => {
        notify(`Error updating ${title ? title : `the ${itemLabel}`}: ${error}`, 'error')
      }
    )
  }

  onRemoveItems = ({itemIds, title=null, successCallback=null}) => {
    const actuatedItems = {
      ids: itemIds,
      title,
      action: 'remove',
      showDialog: true,
      successCallback
    }
    this.setState({actuatedItems})
  }

  removeItems = () => {
    const { itemLabel, removeItems, notify, history, mode } = this.props
    const { actuatedItems } = this.state
    const { title, ids, successCallback } = actuatedItems
    return removeItems(ids).then(
      () => {
        if (mode === 'normal') {
          const { categoryId, categoriesPath } = this.props
          history.push(`/${categoriesPath}/${categoryId}`)
        }
        if (successCallback) {
          successCallback()
        }
        notify(`${title ? title : `The ${itemLabel}`} have been removed`, 'success')
      },
      error => {
        notify(`Error removing ${title ? title : `the ${itemLabel}`}: ${error}`, 'error')
      }
    )
  }

  getNextStates = ({stateId=undefined, isNew=true}) => {
    const { categoryStates } = this.props
    const statesList = categoryStates ? categoryStates.list : null
    let nextStatesIds = []

    if (!statesList) {
      return []
    }

    if (!stateId) {
      nextStatesIds = Object.keys(statesList).filter(id => statesList[id].initial)
    } else if (isNew) {
      nextStatesIds = Object.keys(statesList).filter(id => 
        statesList[id].initial && id !== stateId
      )
    } else {
      const stateInfo = statesList[stateId]
      nextStatesIds = stateInfo && stateInfo.nexts ? stateInfo.nexts : []
    }

    const addWithoutState = categoryStates.required === false && stateId
    let nextStates = nextStatesIds.map(id => ({id, ...statesList[id]}))

    if (addWithoutState) {
      nextStates = [...nextStates, {
        label: 'Detached',
        actionLabel: 'Detach',
        icon: 'undo'
      }] 
    }

    return nextStates
  }

  /* It Transforms an array of states on array to put into a menu 
     rest = title, onSuccess
  */
  getNextStatesAsOperations = ({ stateId=undefined, itemIdsToUpdate=null, onChange=null, ...rest }) => {
    const { categoryStates } = this.props
    const currentState = categoryStates.list[stateId]

    const isNew =  !itemIdsToUpdate

    let nextStates = this.getNextStates({stateId, isNew})
    
    return nextStates.map(nextState => {
      const { label, actionLabel, icon } = nextState
      return {
        id: label,
        icon,
        label: isNew ? label : actionLabel,
        onClick: () => {
          if (!isNew) {
            this.changeState({
              itemIds: itemIdsToUpdate,
              currentState,
              nextState,
              ...rest
            })
          }
          if (onChange) {
            onChange(nextState.id ? nextState : null)
          }
        }
      }
    })
  }

  /*jslint evil: true */
  changeState = ({ itemIds, currentState, nextState, title, onSuccess }) => {
    if (nextState) {
      let newValues = {}
      if (!nextState.id) {
        delete nextState.state
      }
      if (currentState && currentState.onExit) {
        const actions = currentState.onExit.split(';')
        actions.forEach(action => eval(action.replace('[','newValues[')))
      }
      if (nextState.onEnter) {
        const actions = nextState.onEnter.split(';')
        actions.forEach(action => eval(action.replace('[','newValues[')))
      }
      this.onUpdateItems({
        itemIds,
        values: {
          ...newValues,
          state: nextState.id || null
        },
        title,
        action: nextState ? nextState.label.toLowerCase() : 'changed',
        successCallback: onSuccess
      })
    }
  }

  confirmationDialog() {
    const { actuatedItems } = this.state
    const { title, action, ids, showDialog } = actuatedItems
    return (
      <ConfirmationDialog
        open={showDialog}
        message={`Are you sure to want to ${action} ${
          Array.isArray(ids) ?
            `${title ? title.toLowerCase() : 'all these items'}` :
            (title || `this ${this.props.itemLabel}`)
        }?`}
        onAccept={() => {
          action === 'remove' ? this.removeItems() : this.updateItems()
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
        onUpdateItems: this.onUpdateItems,
        getNextStatesAsOperations: this.getNextStatesAsOperations
      }
      switch (mode) {
        case 'normal':
          return (
            <React.Fragment>
              <CategoryList {...commonListProps} showAvatar editable onRemoveItems={this.onRemoveItems} />
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
        onUpdateItems: this.onUpdateItems,
        getNextStatesAsOperations: this.getNextStatesAsOperations
      }
      switch (mode) {
        case 'normal':
          return (
            <React.Fragment>
              <CategoryItemDetail {...commonDetailProps} onRemoveItems={this.onRemoveItems} />
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
        onCreateItems: this.onCreateItems,
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
  createItems: PropTypes.func.isRequired,
  updateItems: PropTypes.func.isRequired,
  removeItems: PropTypes.func.isRequired,
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
  const itemLabel = categorySettings.itemLabel || ''
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
    createItems: (values, quantity) => dispatch(createItems(categoryId, values, quantity)),
    updateItems: (itemIds, values) => dispatch(updateItems(categoryId, itemIds, values)),
    removeItems: itemId => dispatch(removeItems(categoryId, itemId)),
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