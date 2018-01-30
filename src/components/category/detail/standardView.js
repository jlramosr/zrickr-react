import React, { Component } from 'react'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import Category from '../'
import ConfirmationDialog from '../../dialog/confirmation'
import Menu from './../../menu'
import { capitalize } from './../../../utils/helpers'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Check from 'material-ui-icons/Check'
import Directions from 'material-ui-icons/Directions'
import Edit from 'material-ui-icons/Edit'
import Subtitles from 'material-ui-icons/Subtitles'
import Delete from 'material-ui-icons/Delete'

class CategoryItemDetailHeader extends Component {
  initialState = {
    relations: {
      activeIndex: -1,
      activeCategoryId: '',
      activeItemId: ''
    },
    showWhenInfoModeDialog: false,
    checkWhenInfoMode: false,
    checkWhenBack: false,
    hasChanged: false,
    anchorEl: null
  }

  state = this.initialState
  
  componentWillReceiveProps = nextProps => {
    const newOpenRelations = nextProps.openRelations
    const oldNumOpenRelations = this.props.openRelations.length
    const newNumOpenRelations = newOpenRelations.length
    if (newNumOpenRelations !== oldNumOpenRelations) {
      this.changeTab(newNumOpenRelations - 1, newOpenRelations)
    }
  }

  updateItem = values => {
    const { onUpdateItem, itemId, title, changeView } = this.props
    return onUpdateItem(itemId, values, title).then(() => {
      changeView('info')
    })
  }

  onBackClick = () => {
    this.setState({checkWhenBack: true})
  }

  onEditClick = () => {
    this.props.changeView('edit')
  }

  onViewClick = () => {
    this.setState({checkWhenInfoMode: true})
  }

  onRemoveClick = () => {
    const { onRemoveItem, itemId, title } = this.props
    onRemoveItem(itemId, title)
  }

  onCheckClick = () => {
    this.formElement.dispatchEvent(
      new Event('submit'),{bubbles:false}
    )
  }

  onChangeStateClick = event => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleStatesMenuClose = () => {
    this.setState({anchorEl: null})
  }

  whenInfoModeWithChanges = () => {
    this.setState({showWhenInfoModeDialog: true})
  }

  whenInfoModeWithoutChanges = () => {
    const { categoriesPath, categoryId, history, changeView } = this.props
    if (this.state.checkWhenBack) {
      history.push(`/${categoriesPath}/${categoryId}`)
    } else {
      changeView('info')
    }
    this.setState({checkWhenBack: false, checkWhenInfoMode: false, showWhenInfoModeDialog:false})
  }

  whenDifferentValues = () => {
    this.setState({hasChanged: true})
  }

  whenSameValues = () => {
    this.setState({hasChanged: false})
  }

  changeTab = (activeTab, openRelations) => {
    if (!openRelations) {
      openRelations = this.props.openRelations
    }
    if (activeTab < 0) {
      this.setState(this.initialState)
    } else {
      const relation = openRelations[activeTab]
      this.setState({
        relations: {
          activeIndex: activeTab,
          activeCategoryId: relation.categoryId,
          activeItemId: relation.itemId
        }
      })
    }
  }

  render = () => {
    const {
      categoryId,
      categoriesPath,
      itemId,
      title,
      view,
      changeView,
      itemLabel,
      isReadonly,
      categoryStates,
      isFetchingSettings,
      fields,
      isFetchingFields,
      item,
      itemState,
      getNextStatesAsOperations,
      isFetchingItem,
      isUpdating,
      history,
      shouldShowRelations,
      closeRelations,
      removeAllOpenRelations
    } = this.props
    const {
      relations,
      checkWhenInfoMode,
      checkWhenBack,
      showWhenInfoModeDialog,
      hasChanged,
      anchorEl
    } = this.state
    const nextStatesOperations = getNextStatesAsOperations({
      itemId,
      itemValues: item,
      itemTitle: title
    })
    const hiddenChangeStateOp = 
      view === 'edit' || !categoryStates || !Object.keys(categoryStates.list || {}).length
    const disabledChangeStateOp =
      !nextStatesOperations.length
    const editDescription =
      isReadonly ? 
        `It can not be edited because this ${itemLabel} is ${itemState.label.toLowerCase()}` : 
        'Edit'

    return (
      <HeaderLayout
        title={title}
        description={itemState ? `${capitalize(itemLabel)} in state ${itemState.label}` : ''}
        backgroundColor={itemState ? itemState.color : null}
        loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
        operations={[
          {id:'arrowBack', icon:ArrowBack, onClick:this.onBackClick},
          {id:'edit', icon:Edit, right:true, disabled:isReadonly,
            description: editDescription, descriptionWhenDisabled: true, 
            hidden:view==='edit', onClick:this.onEditClick},
          {id:'changeState', icon:Directions, right:true, hidden:hiddenChangeStateOp,
            description: 'Change state', disabled:disabledChangeStateOp, onClick:this.onChangeStateClick},
          {id:'view', icon:Subtitles, right:true, description:'View',
            hidden:view==='info', onClick:this.onViewClick},
          {id:'delete', icon:Delete, right:true, hidden:view==='edit',
            description: 'Delete', onClick:this.onRemoveClick},
          {id:'save', icon:Check, right:true, hidden:view==='info', description: 'Save',
            disabled:!hasChanged || isUpdating, onClick:this.onCheckClick}
        ]}
      >
        <React.Fragment>
          <Form
            cols={12}
            readonly={isReadonly}
            view="detail"
            fields={fields}
            values={item}
            handleSubmit={this.updateItem}
            formRef={el => this.formElement = el}
            infoMode={view === 'info'}
            checks={[
              {handler:checkWhenInfoMode, when:'hasChanged', callback:this.whenInfoModeWithChanges},
              {handler:checkWhenBack, when:'hasChanged', callback:this.whenInfoModeWithChanges},
              {handler:checkWhenInfoMode, when:'hasNotChanged', callback:this.whenInfoModeWithoutChanges},
              {handler:checkWhenBack, when:'hasNotChanged', callback:this.whenInfoModeWithoutChanges}
            ]}
            onDifferentValues={this.whenDifferentValues}
            onEqualValues={this.whenSameValues}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleStatesMenuClose}
            operations={nextStatesOperations}
          />

          <Category
            scene="detail"
            mode="tabs"
            categoryId={relations.activeCategoryId}
            itemId={relations.activeItemId}
            open={shouldShowRelations}
            onChangeTab={this.changeTab}
            onClose={closeRelations}
            onExited={removeAllOpenRelations}
            {...relations}
          />

          <ConfirmationDialog
            open={showWhenInfoModeDialog}
            message='Your changes have not been saved yet. Are you sure to want to continue?'
            onAccept={() => {
              if (this.state.checkWhenBack) {
                history.push(`/${categoriesPath}/${categoryId}`)
              } else {
                document.dispatchEvent(new Event('restart-form'))
              }
              changeView('info')
            }}
            onClose={() => {
              this.setState({checkWhenBack: false, checkWhenInfoMode: false, showWhenInfoModeDialog: false})
            }}
          />

        </React.Fragment>
      </HeaderLayout>
    )
  }
}

export default CategoryItemDetailHeader
