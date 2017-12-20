import React, { Component } from 'react'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
import Delete from 'material-ui-icons/Delete'
import Dialog from '../../dialog'
import CategoryItemDetail from './'
import NotFound from '../../notFound'

class CategoryItemDetailHeader extends Component {
  initialState = {
    relations: {
      activeIndex: -1,
      activeCategoryId: '',
      activeItemId: ''
    }
  }

  state = this.initialState

  changeTab = (activeTab, openRelations) => {
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
    const oldNumOpenRelations = this.props.openRelations.length
    const newNumOpenRelations = nextProps.openRelations.length
    if (oldNumOpenRelations !== newNumOpenRelations) {
      this.changeTab(newNumOpenRelations - 1, nextProps.openRelations)
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
      //itemReceived,
      isUpdating,
      editMode,
      changeEditMode,
      updateItem,
      removeItem,
      openRelations
    } = this.props
    const { relations } = this.state

    return (
      //itemReceived ? (
      item ? (
        <HeaderLayout
          title={title}
          loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
          operations={[
            {id:'arrowBack', icon:ArrowBack, to:`/${categoryId}`},
            {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => changeEditMode(true)},
            {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => changeEditMode(false)},
            {id:'delete', icon:Delete, right:true, hidden:editMode, onClick:removeItem},
            {id:'check', icon:Check, right:true, hidden:!editMode, onClick:() => {
              this.formElement.dispatchEvent(new Event('submit'),{bubbles:false})
            }}
          ]}
        >
          <React.Fragment>
            <Form
              cols={12}
              view="detail"
              infoMode={!editMode}
              fields={fields}
              values={item}
              handleSubmit={updateItem}
              formRef={el => this.formElement = el}
            />
            
            <Dialog
              open={openRelations.length}
              transitionDuration={{ enter: 5500, exit: 5500 }}
            >
              {openRelations.length ? (
                <CategoryItemDetail
                  dialogMode
                  handleChangeTab={this.changeTab}
                  {...relations}
                />
              ) : (
                <div></div>
              )}
            </Dialog>
          </React.Fragment>
        </HeaderLayout>
      ) : (
        <NotFound text="Item Not Found" />
      )
      //) : (
      //  <NotFound text="Loading Item ..." />
      //)
    )
  }
}

export default CategoryItemDetailHeader