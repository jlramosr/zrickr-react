import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { fetchCategoriesIfNeeded } from '../../actions/categories'
import { fetchSettings, fetchSettingsIfNeeded } from '../../actions/settings'
import { fetchFields, fetchFieldsIfNeeded } from '../../actions/fields'
import NotFound from '../notFound'

class Category extends Component {
  componentWillMount = () => {
    this.props.fetchCategoriesIfNeeded()
    this.props.fetchSettings()
    this.props.fetchFields()
  }

  componentDidUpdate = prevProps => {
    /* If multi-user */
    const prevPath = prevProps.location.pathname
    const currentPath = this.props.location.pathname
    if (prevPath !== currentPath) {
      this.props.fetchSettingsIfNeeded()
      this.props.fetchFieldsIfNeeded()
    }
  }

  render = () => {
    const {
      categories,
      categoriesReceived,
      match,
      route 
    } = this.props
    const categoryId = match.params.categoryId
    const category = categories.find(category => category.id === categoryId)
    return (
      categoriesReceived ? (
        category ? (
          <div>
            {renderRoutes(route.routes, {
              categoryId,
              categoryLabel: category.label
            })}
          </div> 
        ) : (
          <NotFound text="Category Not Found" />
        )
      ) : (
        <NotFound text="Loading Categories ..." />
      )
    )
  }
}

Category.propTypes = {
  categories: PropTypes.array.isRequired,
  categoriesReceived: PropTypes.bool.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  fetchFields: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryId: PropTypes.string.isRequired
    })
  }),
  route: PropTypes.object.isRequired
}

const mapStateToProps = ({ categories }) => ({ 
  categories: Object.values(categories.byId),
  categoriesReceived: categories.flow.isReceivedAll
})

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.match.params.categoryId
  return {
    fetchCategoriesIfNeeded: () => dispatch(fetchCategoriesIfNeeded()),
    fetchSettings: () => dispatch(fetchSettings(categoryId)),
    fetchSettingsIfNeeded: () => dispatch(fetchSettingsIfNeeded(categoryId)),
    fetchFields: () => dispatch(fetchFields(categoryId)),
    fetchFieldsIfNeeded: () => dispatch(fetchFieldsIfNeeded(categoryId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)