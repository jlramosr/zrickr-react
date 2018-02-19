import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Reboot from 'material-ui/Reboot'
import renderRoutes from '../../routes'
//<PendingNavDataLoader routes={routes} />*/
import Notifier from '../notifier'
import { setAuthUser } from '../../actions/app'
import { withStyles } from 'material-ui/styles'

/**
 * Core component
 */
class Core extends Component {

  componentDidMount() {
    this.props.setAuthUser()
  }

  render = () => (
    <Reboot>
      {renderRoutes(this.props.authUser)}
      <Notifier />
      {process.env.NODE_ENV === 'development' &&
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
      }
    </Reboot>
  )

}

Core.propTypes = {
  route: PropTypes.object.isRequired
}

const mapStateToProps = ({ app, router }) => ({
  authUser: app.authUser,
  route: router.location
})

const mapDispatchToProps = dispatch => ({
  setAuthUser: () => dispatch(setAuthUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(null, {withTheme: true})(Core)
)
