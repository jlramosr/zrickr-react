import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Reboot from 'material-ui/Reboot'
import { setAuthUser } from '../../actions/app'
import renderRoutes from '../../routes'
import Notifier from '../notifier'
import API from '../../utils/api'

const renderDevMode = () =>
  <div style={{
    position:'absolute',
    top:2,
    left:2,
    color:'#fff',
    background: '#000',
    padding: '2px 8px',
    fontSize: 10,
    zIndex:5000
  }}>
    DEV MODE
  </div>

/**
 * Core component
 */
class Core extends Component {

  componentDidMount = () => {
    API(process.env.REACT_APP_AUTH_SOURCE).fetchAuthUser(authUser => {
      this.props.setAuthUser(authUser) //observator.
    })
  }

  shouldComponentUpdate = nextProps => {
    const { route, authUser } = this.props
    if ((route !== nextProps.route) || (authUser !== nextProps.authUser)) {
      return true
    }
    return false
  }

  render = () => {
    const { isSettingAuthUser, authUser } = this.props
    const logged = Boolean(authUser)

    if (isSettingAuthUser) {
      return (
        <div>
          {'Loading User!'}
        </div>
      )
    }

    return (
      <Reboot>
        {renderRoutes(logged)}
        <Notifier />
        {process.env.NODE_ENV === 'development' && renderDevMode()}
      </Reboot>
    )
  }

}

Core.propTypes = {
  route: PropTypes.object
}

const mapStateToProps = ({ app, router }) => {
  const { session } = app
  const { user, isSetting } = session
  return {
    authUser: user,
    isSettingAuthUser: isSetting,
    route: router.location
  }
}

const mapDispatchToProps = dispatch => ({
  setAuthUser: authUser => dispatch(setAuthUser(authUser))
})


export default connect(mapStateToProps, mapDispatchToProps)(Core)
