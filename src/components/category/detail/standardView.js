import React, { Component } from 'react'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import ConfirmationDialog from '../../dialog/confirmation'
import Menu from './../../menu'
import { capitalize } from './../../../utils/helpers'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'
import Directions from 'material-ui-icons/Directions'
import Edit from 'material-ui-icons/Edit'
import Subtitles from 'material-ui-icons/Subtitles'
import Delete from 'material-ui-icons/Delete'

class CategoryItemDetailHeader extends Component {
  state = {
    /** 
     * for normal mode
     */ 
    hasChanged: false,
    openDialog: false,
    actionDialog: '',
    anchorEl: null
  }

  updateItem = values => {
    const { onUpdateItem, itemId, title, changeAccess } = this.props
    return onUpdateItem(itemId, values, title).then(() => {
      changeAccess('info')
    })
  }

  changeCurrentRelation = newProps => {
    const { mode, changeOpenRelation, openRelations } = this.props
    if (mode === 'temporal') {
      const activeIndex = openRelations.activeIndex
      const relation = openRelations.list[activeIndex]
      changeOpenRelation(activeIndex, {...relation, ...newProps})
    }

  }

  onBackClick = () => {
    const { mode, categoriesPath, categoryId, history } = this.props
    if (mode === 'normal') {
      if (!this.state.hasChanged) {
        history.push(`/${categoriesPath}/${categoryId}`)
      } else {
        this.setState({openDialog: true, actionDialog:'update-back'})
      }
    }
  }

  onCloseClick = () => {
    const { mode, openRelations, closeDialog } = this.props
    if (mode === 'temporal') {
      const { activeIndex, list } = openRelations
      list[activeIndex].tempValues ?
        this.setState({openDialog: true, actionDialog:'update-back'}) :
        closeDialog()
    }
  }

  onEditClick = () => {
    const { mode, changeAccess} = this.props
    if (mode === 'normal') {
      changeAccess('edit')
    } else if (mode === 'temporal') {
      this.changeCurrentRelation({access:'edit'})
    }
  }

  onInfoClick = () => {
    const { mode, changeAccess, openRelations } = this.props
    if (mode === 'normal') {
      this.state.hasChanged ?
        this.setState({openDialog: true, actionDialog: 'update-info'}) :
        changeAccess('info')
    } else if (mode === 'temporal') {
      const { activeIndex, list } = openRelations
      list[activeIndex].tempValues ?
        this.setState({openDialog: true, actionDialog: 'update-info'}) :
        this.changeCurrentRelation({access:'info'})
    }
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

  onChangeForm = tempValues => {
    if (this.props.mode === 'temporal') {
      this.changeCurrentRelation({tempValues})
    }
  }

  onDifferentValues = () => {
    const { mode } = this.props
    if (mode === 'normal') {
      this.setState({hasChanged: true})
    }
  }

  onEqualValues = () => {
    const { mode } = this.props
    if (mode === 'normal') {
      this.setState({hasChanged: false})
    } else if (mode === 'temporal') {
      this.changeCurrentRelation({tempValues: null})
    }
  }

  render = () => {
    const {
      categoryId,
      categoriesPath,
      itemId,
      title,
      mode,
      access,
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
      openRelations,
      closeDialog,
      history
    } = this.props
    const {
      openDialog,
      actionDialog,
      anchorEl
    } = this.state

    let formValues = item
    let formAccess = access
    let tempItem = null
    let hasChanged = this.state.hasChanged
    if (mode === 'temporal') {
      const { activeIndex, list } = openRelations
      tempItem = list[activeIndex]
      const { tempValues, access } = tempItem
      formValues = tempValues ? tempValues : item
      hasChanged = tempValues ? true : false
      formAccess = access
    }

    const nextStatesOperations = getNextStatesAsOperations({
      itemId,
      itemValues: item,
      itemTitle: title
    })
    const hiddenChangeStateOp = 
      formAccess === 'edit' || !categoryStates || !Object.keys(categoryStates.list || {}).length
    const disabledChangeStateOp = !nextStatesOperations.length
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
          {
            id: 'arrowBack',
            icon: ArrowBack,
            hidden: mode !== 'normal',
            onClick: this.onBackClick
          },
          {
            id: 'close',
            icon: Close,
            hidden: mode !== 'temporal' || openRelations.list.length > 1,
            onClick: this.onCloseClick
          },
          {
            id: 'edit',
            icon: Edit,
            right: true,
            disabled: isReadonly,
            description: editDescription,
            descriptionWhenDisabled: true, 
            hidden: formAccess === 'edit',
            onClick: this.onEditClick
          },
          {
            id: 'info',
            icon: Subtitles,
            right: true,
            description: 'view',
            hidden: formAccess === 'info',
            onClick: this.onInfoClick
          },
          {
            id: 'changeState',
            icon: Directions,
            right: true,
            hidden: hiddenChangeStateOp,
            description: 'Change state',
            disabled: disabledChangeStateOp,
            onClick: this.onChangeStateClick
          },
          {
            id:'delete',
            icon: Delete,
            right: true,
            hidden: formAccess === 'edit' || mode !== 'normal',
            description: 'Delete',
            onClick: this.onRemoveClick
          },
          {
            id: 'save',
            icon: Check,
            right: true,
            hidden: formAccess === 'info',
            description: 'Save',
            disabled: isUpdating || !hasChanged,
            onClick:this.onCheckClick
          }
        ]}
      >
        <React.Fragment>
          <Form
            cols={12}
            readonly={isReadonly}
            view="detail"
            fields={fields}
            values={formValues}
            origValues={mode === 'temporal' ? item : null}
            infoMode={formAccess === 'info'}
            formRef={el => this.formElement = el}
            handleSubmit={this.updateItem}
            onChange={this.onChangeForm}
            onDifferentValues={this.onDifferentValues}
            onEqualValues={this.onEqualValues}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleStatesMenuClose}
            operations={nextStatesOperations}
          />

          <ConfirmationDialog
            open={openDialog}
            message={'Your changes have not been saved yet. Are you sure to want to continue?'}
            onAccept={() => {
              if (mode === 'normal') {
                if (actionDialog === 'update-back') {
                  history.push(`/${categoriesPath}/${categoryId}`)
                } else if (actionDialog === 'update-info') {
                  document.dispatchEvent(new Event('restart-form'))
                  this.props.changeAccess('info')
                }
              } else if (mode === 'temporal') {
                if (actionDialog === 'update-info') {
                  document.dispatchEvent(new Event('restart-form'))
                  this.changeCurrentRelation({access: 'info', tempValues: null})
                } else if (actionDialog === 'update-back') {
                  closeDialog()
                }
              }
            }}
            onClose={() => {
              this.setState({openDialog: false, actionDialog: ''})
            }}
          />

        </React.Fragment>
      </HeaderLayout>
    )
  }
}

export default CategoryItemDetailHeader
