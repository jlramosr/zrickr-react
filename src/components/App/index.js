import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchCategories } from '../../actions/categories'
import { renderRoutes } from 'react-router-config'
import Drawer from '../drawer'

/**
 * Main app component, with common drawer and first level routes.
 */
class App extends Component {
  componentDidMount = () => {
    this.props.fetchCategories()
  }

  componentDidUpdate = () => {
    const { currentPath, fetchCategories } = this.props
    if (currentPath === '/') {
      fetchCategories()
    }
  }

  render = () => (
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
   * to know how it generates
   */
  route: PropTypes.object.isRequired,
  /**
   * Current location path. It obtains from Redux store.
   * @see See [GitHub](https://github.com/reactjs/react-router-redux)
   * to know how router provider works.
   */
  currentPath: PropTypes.string.isRequired,
  /**
   * Get all categories from Redux store.
   */
  fetchCategories: PropTypes.func.isRequired
}

const mapStateToProps = ({ router }) => ({ 
  currentPath: router.location.pathname
})

const mapDispatchToProps = dispatch => ({
  fetchCategories: () => dispatch(fetchCategories())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
