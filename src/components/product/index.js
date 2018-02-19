import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
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

  onSubmit = event => {
    console.log("SUBMIT!!!");
    const { email, password} = this.state
    const { history } = this.props

    API('firebase').signInWithPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...initialState }))
        //history.push(routes.HOME);
        console.log('VIVA')
      })
      .catch(error => {
        //this.setState(byPropKey('error', error))
        console.log('MAL', error)
      })

    event.preventDefault()
  }

  render = () => {
    const { email, password, error } = this.state
    const isInvalid = false // password === '' || email === ''

    return (
      <button disabled={isInvalid} onClick={this.onSubmit}>
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

})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(Product)
)