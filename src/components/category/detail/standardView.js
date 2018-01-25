import React, { Component } from 'react'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import CategoryItemDetail from './'
import Dialog from '../../dialog/large'
import ConfirmationDialog from '../../dialog/confirmation'
import Menu from './../../menu'
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
    showStatesMenu: false,
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
    const { onUpdateItem, categoryId, itemId, title, changeEditMode } = this.props
    return onUpdateItem(categoryId, itemId, values, title).then(() => {
      changeEditMode(false)
    })
  }

  onBackClick = () => {
    this.setState({checkWhenBack: true})
  }

  onEditClick = () => {
    this.props.changeEditMode(true)
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
    this.setState({showStatesMenu: true, anchorEl: event.currentTarget})
  }

  handleStatesMenuClose = () => {
    this.setState({showStatesMenu: false, anchorEl: null})
  }

  whenInfoModeWithChanges = () => {
    this.setState({showWhenInfoModeDialog: true})
  }

  whenInfoModeWithoutChanges = () => {
    const { history, changeEditMode, categoryId } = this.props
    if (this.state.checkWhenBack) {
      history.push(`/${categoryId}`)
    } else {
      changeEditMode(false)
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
      itemId,
      title,
      onCreateItem,
      onUpdateItem,
      categoryItemLabel,
      categoryStates,
      isFetchingSettings,
      fields,
      isFetchingFields,
      item,
      itemState,
      getNextStatesAsOperations,
      isFetchingItem,
      isUpdating,
      editMode,
      changeEditMode,
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
      showStatesMenu,
      anchorEl
    } = this.state
    const nextStatesOperations = getNextStatesAsOperations({
      categoryId,
      itemId,
      itemValues: item,
      categoryStates,
      itemTitle: title
    })
    const hiddenChangeStateOp = 
      editMode || !categoryStates || !Object.keys(categoryStates.list || {}).length
    const disabledChangeStateOp = !nextStatesOperations.length

    return (
      <HeaderLayout
        title={title}
        description={itemState ? `${categoryItemLabel} in state ${itemState.label}` : ''}
        backgroundColor={itemState ? itemState.color : null}
        loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
        operations={[
          {id:'arrowBack', icon:ArrowBack, onClick:this.onBackClick},
          {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:this.onEditClick},
          {id:'changeState', icon:Directions, right:true, hidden:hiddenChangeStateOp,
            disabled: disabledChangeStateOp, onClick:this.onChangeStateClick},
          {id:'view', icon:Subtitles, right:true, hidden:!editMode, onClick:this.onViewClick},
          {id:'delete', icon:Delete, right:true, hidden:editMode, onClick:this.onRemoveClick},
          {id:'save', icon:Check, right:true, hidden:!editMode,
            disabled:!hasChanged || isUpdating, onClick:this.onCheckClick}
        ]}
      >
        <React.Fragment>
          <Form
            cols={12}
            view="detail"
            fields={fields}
            values={item}
            handleSubmit={this.updateItem}
            formRef={el => this.formElement = el}
            infoMode={!editMode}
            onCreateItem={onCreateItem}
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
            open={showStatesMenu}
            onClose={this.handleStatesMenuClose}
            operations={nextStatesOperations}
          />

          <Dialog
            open={shouldShowRelations}
            onClose={closeRelations}
            onExited={removeAllOpenRelations}
          >
            <CategoryItemDetail
              dialogMode
              onUpdateItem={onUpdateItem}
              changeTab={this.changeTab}
              {...relations}
            />
          </Dialog>

          <ConfirmationDialog
            open={showWhenInfoModeDialog}
            message='Your changes have not been saved yet. Are you sure to want to continue?'
            onAccept={() => {
              if (this.state.checkWhenBack) {
                history.push(`/${categoryId}`)
              } else {
                document.dispatchEvent(new Event('restart-form'))
              }
              changeEditMode(false)
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
