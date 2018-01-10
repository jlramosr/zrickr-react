import React, { Component } from 'react'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import CategoryItemDetail from './'
import LargeDialog from '../../dialog/large'
import ConfirmationDialog from '../../dialog/confirmation'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Check from 'material-ui-icons/Check'
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
    checkWhenInfoMode: false
  }

  state = this.initialState

  onEditClick = () => {
    this.props.changeEditMode(true)
  }

  onViewClick = () => {
    this.setState({checkWhenInfoMode: true})
  }

  onCheckClick = () => {
    this.formElement.dispatchEvent(
      new Event('submit'),{bubbles:false}
    )
  }

  whenInfoModeWithChanges = () => {
    this.setState({showWhenInfoModeDialog: true})
  }

  whenInfoModeWithoutChanges = () => {
    this.props.changeEditMode(false)
    this.setState({checkWhenInfoMode: false, showWhenInfoModeDialog:false})
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

  componentWillReceiveProps = nextProps => {
    const newOpenRelations = nextProps.openRelations
    const oldNumOpenRelations = this.props.openRelations.length
    const newNumOpenRelations = newOpenRelations.length
    if (newNumOpenRelations !== oldNumOpenRelations) {
      this.changeTab(newNumOpenRelations - 1, newOpenRelations)
    }
  }

  render = () => {
    const {
      categoryId,
      title,
      isFetchingSettings,
      fields,
      isFetchingFields,
      item,
      isFetchingItem,
      isUpdating,
      editMode,
      changeEditMode,
      updateItem,
      removeItem,
      shouldShowRelations,
      closeRelations,
      removeAllOpenRelations
    } = this.props
    const { relations, checkWhenInfoMode, showWhenInfoModeDialog } = this.state

    return (
      <HeaderLayout
        title={title}
        loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
        operations={[
          {id:'arrowBack', icon:ArrowBack, to:`/${categoryId}`},
          {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:this.onEditClick},
          {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:this.onViewClick},
          {id:'delete', icon:Delete, right:true, hidden:editMode, onClick:removeItem},
          {id:'check', icon:Check, right:true, hidden:!editMode, onClick:this.onCheckClick}
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
              {when:'hasChanged', handler:checkWhenInfoMode, callback:this.whenInfoModeWithChanges},
              {when:'hasNotChanged', handler:checkWhenInfoMode, callback:this.whenInfoModeWithoutChanges}
            ]}
          />

          <LargeDialog
            open={shouldShowRelations}
            onClose={closeRelations}
            onExited={removeAllOpenRelations}
          >
            <CategoryItemDetail
              dialogMode
              changeTab={this.changeTab}
              {...relations}
            />
          </LargeDialog>

          <ConfirmationDialog
            open={showWhenInfoModeDialog}
            message='Your changes have not been saved yet. Are you sure to want to continue?'
            onAccept={() => {
              changeEditMode(false)
              document.dispatchEvent(new Event('restart-form'))
            }}
            onClose={() => {
              this.setState({checkWhenInfoMode: false, showWhenInfoModeDialog: false})
            }}
          />

        </React.Fragment>
      </HeaderLayout>
    )
  }
}

export default CategoryItemDetailHeader
