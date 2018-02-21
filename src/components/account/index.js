import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import LoggedIn from './loggedIn'
import LoggedOut from './loggedOut'

let Account = props => props.user ? <LoggedIn {...props} /> : <LoggedOut {...props} />

Account.propTypes = {
  user: PropTypes.object
}

const mapStateToProps = ({ app }) => ({
  user: app.session.user
})

export default connect(mapStateToProps)(Account)