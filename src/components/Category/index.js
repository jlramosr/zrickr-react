import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { fetchCategoriesIfNeeded } from '../../actions/categories'
import { fetchSettings } from '../../actions/settings'
import { fetchFields } from '../../actions/fields'
import { fetchItems } from '../../actions/items'
import NotFound from '../notFound'

class Category extends Component {
  componentDidMount = () => {
    this.props.fetchCategoriesIfNeeded()
    this.props.fetchSettings()
    this.props.fetchFields()
    this.props.fetchItems()
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
    return categoriesReceived ? (
      category ? (
        <div>
          {renderRoutes(route.routes, {
            categoryId,
            categoryLabel: category.label,
            settingsId: category.settings || {},
            fieldsIds: category.fields || [],
            itemsIds: category.items || []
          })}
        </div> 
      ) : (
        <NotFound text="Category Not Found" />
      )
    ) : (
      <NotFound text="Loading Categories ..." />
    )
  }
}

Category.propTypes = {
  categories: PropTypes.array.isRequired,
  categoriesReceived: PropTypes.bool.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  fetchFields: PropTypes.func.isRequired,
  fetchItems: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryId: PropTypes.string.isRequired
    })
  }),
  route: PropTypes.object.isRequired
}

const mapStateToProps = ({ categories }) => ({ 
  categories: Object.values(categories.byId),
  categoriesReceived: categories.flow.isReceived
})

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.match.params.categoryId
  return {
    fetchCategoriesIfNeeded: () => dispatch(fetchCategoriesIfNeeded()),
    fetchSettings: () => dispatch(fetchSettings(categoryId)),
    fetchFields: () => dispatch(fetchFields(categoryId)),
    fetchItems: () => dispatch(fetchItems(categoryId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)