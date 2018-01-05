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
    showConfirmDialog: false,
    isChangingToInfoMode: false
  }

  state = this.initialState

  openDialog = () => {
    this.setState({showConfirmDialog: true})
  }

  noOpenDialog = () => {
    this.props.changeEditMode(false)
    this.setState({isChangingToInfoMode: false, showConfirmDialog:false})
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
    const { relations, isChangingToInfoMode, showConfirmDialog } = this.state

    return (
      <HeaderLayout
        title={title}
        loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
        operations={[
          {id:'arrowBack', icon:ArrowBack, to:`/${categoryId}`},
          {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => changeEditMode(true)},
          {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => 
            this.setState({isChangingToInfoMode: true})
          },
          {id:'delete', icon:Delete, right:true, hidden:editMode, onClick:removeItem},
          {id:'check', icon:Check, right:true, hidden:!editMode, onClick:() => {
            this.formElement.dispatchEvent(
              new Event('submit'),{bubbles:false}
            )
          }}
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
            isChangingToInfoMode={isChangingToInfoMode}
            openDialog={this.openDialog}
            noOpenDialog={this.noOpenDialog}
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
            open={showConfirmDialog}
            message='Your changes have not been saved yet. Are you sure to want to continue?'
            onAccept={() => {
              changeEditMode(false)
              document.dispatchEvent(new Event('restart-form'))
            }}
            onClose={() => {
              this.setState({isChangingToInfoMode: false, showConfirmDialog: false})
            }}
          />

        </React.Fragment>
      </HeaderLayout>
    )
  }
}

export default CategoryItemDetailHeader
