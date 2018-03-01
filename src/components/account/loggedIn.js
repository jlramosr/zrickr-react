import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HeaderLayout from '../headerLayout'
import Form from '../form'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import { withStyles } from 'material-ui/styles'

const styles = () => ({

})

class AccountLoggedOut extends Component  {
  state = {
    formAccess: 'info',
    differentFromOrig: false
  }

  updateUser = user => {
    console.log('updateUser', user)
  }

  onBackClick = () => {
    this.props.history.push('/')
  }

  onEditClick = () => {
    this.setState({formAccess: 'edit'})
  }

  onCheckClick = () => {
    this.setState({formAccess: 'info'})
  }

  onChangeForm = () => {
    console.log('onChangeForm')
  }

  onDifferentValues = () => {
    this.setState({differentFromOrig: true}) 
  }

  onEqualValues = () => {
    this.setState({differentFromOrig: false}) 
  }

  render = () => {
    const { user } = this.props
    const { formAccess, differentFromOrig } = this.state

    const fields = [
      //defined fields here.
    ]

    const values = {
      //defined values here.
    }

    return (
      <HeaderLayout
        title={user.displayName}
        operations={[
          {
            id: 'arrowBack',
            icon: ArrowBack,
            onClick: this.onBackClick
          },
          {
            id: 'edit',
            icon: Edit,
            right: true, 
            hidden: formAccess === 'edit',
            onClick: this.onEditClick
          },
          {
            id: 'save',
            icon: Check,
            right: true,
            hidden: formAccess === 'info',
            description: 'Save',
            disabled: !differentFromOrig,
            onClick: this.onCheckClick
          }
        ]}
      >
        <Form
          cols={12}
          view="detail"
          fields={fields}
          values={values}
          infoMode={formAccess === 'info'}
          formRef={el => this.formElement = el}
          onSubmit={this.updateUser}
          onChange={this.onChangeForm}
          onDifferentValues={this.onDifferentValues}
          onEqualValues={this.onEqualValues}
        />
      </HeaderLayout>
    )
  }
}

AccountLoggedOut.propTypes = {
  user: PropTypes.object.isRequired
}

export default withStyles(styles)(AccountLoggedOut)