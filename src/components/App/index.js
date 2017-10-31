import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchCategories } from '../../actions/categories'
import { renderRoutes } from 'react-router-config'
import Drawer from '../drawer'

/**
 * Main app component, with common Drawer and first level routes.
 *
 */
class App extends Component {
  componentDidMount = _ => this.props.fetchCategories()

  render = _ => (
    <div>
      <Drawer />
      {renderRoutes(this.props.route.routes)}
    </div>
  )
}

App.propTypes = {
  /**
   * Info with all the app routes and rendered components for every one of them.
   * @see See [GitHub](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config)
   * to see how it generates
   */
  route: PropTypes.object.isRequired,
    /**
   * Get all categories from Redux store.
   */
  fetchCategories: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  fetchCategories: _ => dispatch(fetchCategories()),
})

export default connect(null, mapDispatchToProps)(App)
