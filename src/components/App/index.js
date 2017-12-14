import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchCategories, fetchCategoriesIfNeeded } from '../../actions/categories'
import { renderRoutes } from 'react-router-config'
import Drawer from '../drawer'
import Notifier from '../notifier'
import ControlledDialog from '../dialog/index2'

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
      this.props.fetchCategoriesIfNeeded()
    }
  }

  render = () => (
    <React.Fragment>
      {renderRoutes(this.props.route.routes)}
      <Drawer />
      <Notifier />
      <ControlledDialog />
    </React.Fragment>
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
  fetchCategories: PropTypes.func.isRequired,
  fetchCategoriesIfNeeded: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  fetchCategories: () => dispatch(fetchCategories()),
  fetchCategoriesIfNeeded: () => dispatch(fetchCategoriesIfNeeded())
})

export default connect(null, mapDispatchToProps)(App)
