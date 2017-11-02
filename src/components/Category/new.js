import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HeaderLayout from '../headerLayout'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'

class CategoryItemNew extends Component {

  _createItem = () => {
    console.log('CREAR ITEM')
    this.props.closeDialog()
  }

  render = () => {
    const { closeDialog, itemLabel } = this.props

    return (
      <HeaderLayout
        title={`Nuevo ${itemLabel}`} 
        operations={[
          {id:'close', icon:Close, onClick:closeDialog},
          {id:'check', icon:Check, right: true, onClick:this._createItem}
        ]}
      >
      </HeaderLayout>
    )
  }
}

CategoryItemNew.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  itemLabel: PropTypes.string
}

export default CategoryItemNew
