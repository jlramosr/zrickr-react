import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Reboot from 'material-ui/Reboot'
import { renderRoutes } from 'react-router-config'
import routes from '../../routes'
//<PendingNavDataLoader routes={routes} />*/
import Notifier from '../notifier'
import { withStyles } from 'material-ui/styles'
import API from '../../utils/api'

/**
 * Core component
 */
class Core extends Component {
  state = {
    auth: null
  }

  componentDidMount() {
    const auth = API(process.env.REACT_APP_ITEMS_SOURCE).getUser()
    if (auth) {
      this.setState({auth})
    }
  }

  render = () => {

    if (!this.state.user) {
      return (
        <div>hola</div>
      )
    }

    return (
      <Reboot>
        {renderRoutes(routes)}
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
}

Core.propTypes = {
  
}

const mapStateToProps = ({ interactions }) => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(null, {withTheme: true})(Core)
)
