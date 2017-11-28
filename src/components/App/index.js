import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchCategories } from '../../actions/categories'
import { renderRoutes } from 'react-router-config'
import Drawer from '../drawer'
import Notifier from '../notifier'

/**
 * Main app component, with common drawer and first level routes.
 */
class App extends Component {
  componentWillMount = () => {
    this.props.fetchCategories()
  }

  componentDidUpdate = prevProps => {
    /* If multi-user */
    const prevPath = prevProps.location.pathname
    const currentPath = this.props.location.pathname
    if (prevPath !== currentPath && currentPath === '/') {
      this.props.fetchCategories()
    }
  }

  render = () => (
    <div>
      {renderRoutes(this.props.route.routes)}
      <Drawer />
      <Notifier />
    </div>
  )
}

App.propTypes = {
  /**
   * Info with all the app routes and rendered components for every one of them.
   * @see See [GitHub](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config)
   * to know how it generates
   */
  route: PropTypes.object.isRequired,
  /**
   * Get all categories from Redux store.
   */
  fetchCategories: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  fetchCategories: () => dispatch(fetchCategories())
})

export default connect(null, mapDispatchToProps)(App)
