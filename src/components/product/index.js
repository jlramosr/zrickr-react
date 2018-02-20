import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { settingAuthUser, setAuthUser } from '../../actions/app'
import API from '../../utils/api'

const styles = theme => ({

})

const initialState = {
  email: '',
  password: '',
  error: null
}

class Product extends Component  {
  state = { ...initialState}

  onSignIn = event => {
    const { email, password} = this.state
    const { history, settingAuthUser } = this.props

    settingAuthUser()

    API(process.env.REACT_APP_AUTH_SOURCE).signInWithProvider('google')
      .then(() => {
        API(process.env.REACT_APP_AUTH_SOURCE).fetchAuthUser(authUser => {
          setAuthUser(authUser)
        })
      })
      .catch(error => {
        //this.setState(byPropKey('error', error))
      })

    event.preventDefault()
  }

  render = () => {
    const { email, password, error } = this.state
    const isInvalid = false // password === '' || email === ''

    return (
      <button disabled={isInvalid} onClick={this.onSignIn}>
        Sign In
      </button>
    )
  }
}

Product.propTypes = {
}

const mapStateToProps = ({ interactions }) => ({
})

const mapDispatchToProps = dispatch => ({
  settingAuthUser: () => dispatch(settingAuthUser()),
  setAuthUser: authUser => dispatch(setAuthUser(authUser))
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(Product)
)