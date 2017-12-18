import React, { Component } from 'react'
import HeaderLayout from '../headerLayout'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
import Delete from 'material-ui-icons/Delete'
import NotFound from '../notFound'

class CategoryItemDetailHeader extends Component {
  render = () => {
    const {
      title,
      editMode,
      categoryId,
      isFetchingSettings,
      isFetchingFields,
      item,
      isFetchingItem,
      isUpdating,
      closeDialog,
      changeEditMode,
      children
    } = this.props

    return (
      item ? (
        <HeaderLayout
          title={title}
          loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
          operations={[
            {id:'arrowBack', icon:ArrowBack, to:`/${categoryId}`},
            //{id:'close', icon:Close, hidden:!dialogMode, onClick:closeDialog},
            {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => changeEditMode(true)},
            {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => changeEditMode(false)},
            {id:'delete', icon:Delete, right:true, hidden:editMode, onClick:this.removeItem},
            {id:'check', icon:Check, right:true, hidden:!editMode, onClick: () => {
              this.formElement.dispatchEvent(new Event('submit'),{bubbles:false})
            }}
          ]}
        >
          {children}
        </HeaderLayout>
      ) : (
        <NotFound text="Item Not Found" />
      )
    )
  }
}

export default CategoryItemDetailHeader
