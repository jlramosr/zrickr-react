import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { settingAuthUser, setAuthUser } from '../../actions/app'
import API from '../../utils/api'

const styles = theme => ({
  root: {
    display: 'block',
    height: '100vh',
    background: '#fefefe'
  },
  containerVertical: {
    maxWidth: 460,
    margin: '0 auto',
    padding: 40
  },
  containerHorizontal: {
    maxWidth: '100%',
    margin: '0 auto'
  },
  img: {
    width: 192,
    height: 192
  },
  h2: {
    fontSize: 22,
    margin: '20px 0',
    fontWeight: 600
  },
  a: {
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 12
  },
  section: {
    margin: '0 24px 16px'
  },
  forgot: {
    marginLeft: 'auto',
    marginTop: -10
  },
  sectionOr: {
    width: '100%',
    color: '#888',
    marginBottom: 16
  },
  separatorHorizontal: {
    border: 0,
    height: 1,
    background: '#888'
  },
  separatorVertical: {
    display: 'inline',
    border: 0,
    width: 1,
    background: '#888'
  },
  button: {
    background: theme.palette.primary.main
  },
  formInput: {
    width: 268
  }
})

const initialState = {
  email: '',
  password: '',
  error: null
}

class AccountLoggedOut extends Component  {
  state = { ...initialState}

  onSignIn = (event, provider) => {
    event.preventDefault()
    const { email, password} = this.state
    const { settingAuthUser } = this.props
    const authSource = process.env.REACT_APP_AUTH_SOURCE

    settingAuthUser()

    if (!provider) {
      API(authSource).signInWithPassword(email, password)
        .then(() => {

        })
        .catch(error => {
          this.setState({error})
        })
        .finally(() => {
          /*API(process.env.REACT_APP_AUTH_SOURCE).fetchAuthUser(authUser => {
            setAuthUser(authUser)
          })*/
        })
    } else {
      API(authSource).signInWithProvider(provider)
        .then(() => {

        })
        .catch(error => {
          this.setState({error})
        })
        .finally(() => {
          /*API(process.env.REACT_APP_AUTH_SOURCE).fetchAuthUser(authUser => {
            setAuthUser(authUser)
          })*/
        })
    }
  }


  render = () => {
    const { classes } = this.props
    const { email, password } = this.state

    const mediumScreen = true

    return (
      <div className={classes.root}>

        <div className={classes.button}>
          <img alt="logo" src="../../public/favicon.ico"></img>
        </div>

        <div className={classes.separatorTop} hidden={mediumScreen}></div>

        <div className={classes.section}>
          <input
            className={classes.formInput}
            name="email"
            value={email}
            placeholder="email"
            onChange={() => {this.setState({email})}}
          />
          <input
            className={classes.formInput}
            name="password"
            value={password}
            placeholder="password"
            type="password"
            onChange={() => {this.setState({password})}}
          />
          <div className={classes.forgot}>
            <a><span>Forgot your password?</span></a>
          </div>
          <div>
            <button className={classes.button} onClick={this.onSignIn}>
              Sign in with email and password
            </button>
          </div>
        </div>

        <div className={classes.separatorVertical} hidden={mediumScreen}></div>

        <div className={classes.section}>

          <div className={classes.sectionOr} hidden={!mediumScreen}>
            <div className={classes.separatorVertical}></div>
            <span>or</span>
            <div className={classes.separatorVertical}></div>
          </div>

          <button className={classes.button} onClick={event => this.onSignIn(event, 'google')}>
            Sign in with Google
          </button>  
          <button className={classes.button} onClick={event => this.onSignIn(event, 'facebook')}>
            Sign in with Facebook
          </button>  
          <button className={classes.button} onClick={event => this.onSignIn(event, 'twitter')}>
            Sign in with Twitter
          </button>
          <button className={classes.button} onClick={event => this.onSignIn(event, 'github')}>
            Sign in with Github
          </button>

        </div>

      </div>
    ) 
  }
}

AccountLoggedOut.propTypes = {
  settingAuthUser: PropTypes.func.isRequired,
  setAuthUser: PropTypes.func.isRequired
}

const mapStateToProps = () => ({
  
})

const mapDispatchToProps = dispatch => ({
  settingAuthUser: () => dispatch(settingAuthUser()),
  setAuthUser: authUser => dispatch(setAuthUser(authUser))
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(AccountLoggedOut)
)