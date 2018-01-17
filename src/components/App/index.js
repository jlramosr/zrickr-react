import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { updateWindowSize } from '../../actions/interactions'
import { fetchCategories, fetchCategoriesIfNeeded } from '../../actions/categories'
import { renderRoutes } from 'react-router-config'
import Drawer from '../drawer'
import Notifier from '../notifier'
import { withStyles } from 'material-ui/styles'

/**
 * Main app component, with common drawer and first level routes.
 */
class App extends Component {

  componentDidMount = () => {
    window.addEventListener('resize', () =>
      this.resize(this.props.theme)
    )
    this.resize(this.props.theme)
  }

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

  componentWillUnmount = () => {
    window.removeEventListener('resize', () =>
      this.resize(this.props.theme)
    )
  }

  /**
   * Update size variable of the state to control the fields position.
	 * @public
   * @param {object} theme The theme with breakpoints variables.
   * @returns {void}
	 */ 
  resize = theme => {
    const width = window.innerWidth
    const { windowSize, updateWindowSize } = this.props
    let size = 'xs'
    if (width >= theme.breakpoints.width('xl')) {
      size = 'xl'
    } else if (width >= theme.breakpoints.width('lg')) {
      size = 'lg'
    } else if (width >= theme.breakpoints.width('md')) {
      size = 'md'
    } else if (width >= theme.breakpoints.width('sm')) {
      size = 'sm'
    }
    if (size !== windowSize) {
      updateWindowSize(size)
    }
  }

  render = () => (
    <React.Fragment>
      {renderRoutes(this.props.route.routes)}
      <Drawer />
      <Notifier />
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

const mapStateToProps = ({ interactions }, props) => ({ 
  windowSize: interactions.windowSize
})

const mapDispatchToProps = dispatch => ({
  updateWindowSize: size => dispatch(updateWindowSize(size)),
  fetchCategories: () => dispatch(fetchCategories()),
  fetchCategoriesIfNeeded: () => dispatch(fetchCategoriesIfNeeded())
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(null, {withTheme: true})(App)
)
