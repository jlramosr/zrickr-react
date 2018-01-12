import React, { Component } from 'react'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import CategoryItemDetail from './'
import Dialog from '../../dialog/large'
import ConfirmationDialog from '../../dialog/confirmation'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Check from 'material-ui-icons/Check'
import CallSplit from 'material-ui-icons/CallSplit'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
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
    showWhenRemoveDialog: false
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

  onChangeStateClick = () => {

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
    this.setState({showWhenRemoveDialog: true})
  }

  onCheckClick = () => {
    this.formElement.dispatchEvent(
      new Event('submit'),{bubbles:false}
    )
  }

  whenInfoModeWithChanges = () => {
    console.log("HOLAaaaaaaaaaaaa11111111111");
    this.setState({showWhenInfoModeDialog: true})
  }

  whenInfoModeWithoutChanges = () => {
    console.log("HOLAaaaaaaaaaaaa222222222222");
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
      itemLabel,
      title,
      isFetchingSettings,
      fields,
      isFetchingFields,
      item,
      isFetchingItem,
      isUpdating,
      editMode,
      changeEditMode,
      history,
      updateItem,
      removeItem,
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
      showWhenRemoveDialog
    } = this.state

    const showCheckIcon = editMode && hasChanged && !isUpdating

    return (
      <HeaderLayout
        title={title}
        loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
        operations={[
          {id:'arrowBack', icon:ArrowBack, onClick:this.onBackClick},
          {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:this.onEditClick},
          {id:'changeState', icon:CallSplit, right:true, hidden:editMode, onClick:this.onChangeStateClick},
          {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:this.onViewClick},
          {id:'delete', icon:Delete, right:true, hidden:editMode, onClick:this.onRemoveClick},
          {id:'check', icon:Check, right:true, hidden:!showCheckIcon, onClick:this.onCheckClick}
        ]}
      >
        <React.Fragment>
          <Form
            cols={12}
            view="detail"
            fields={fields}
            values={item}
            handleSubmit={updateItem}
            formRef={el => this.formElement = el}
            infoMode={!editMode}
            checks={[
              {handler:checkWhenInfoMode, when:'hasChanged', callback:this.whenInfoModeWithChanges},
              {handler:checkWhenBack, when:'hasChanged', callback:this.whenInfoModeWithChanges},
              {handler:checkWhenInfoMode, when:'hasNotChanged', callback:this.whenInfoModeWithoutChanges},
              {handler:checkWhenBack, when:'hasNotChanged', callback:this.whenInfoModeWithoutChanges}
            ]}
            onDifferentValues={this.whenDifferentValues}
            onEqualValues={this.whenSameValues}
          />

          <Dialog
            open={shouldShowRelations}
            onClose={closeRelations}
            onExited={removeAllOpenRelations}
          >
            <CategoryItemDetail
              dialogMode
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

          <ConfirmationDialog
            open={showWhenRemoveDialog}
            message={`Are you sure to want to remove this ${itemLabel}?`}
            onAccept={() => {
              removeItem()
            }}
            onClose={() => {
              this.setState({showWhenRemoveDialog: false})
            }}
          />

        </React.Fragment>
      </HeaderLayout>
    )
  }
}

export default CategoryItemDetailHeader
