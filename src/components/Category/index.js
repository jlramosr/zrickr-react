import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import NotFound from '../notFound'

let Category = props => {
  const { categories, categoriesReceived, match, route } = props
  const categoryId = match.params.categoryId
  const category = categories.find(category => category.id === categoryId)
  return categoriesReceived ? (
    category ?
      <div>{renderRoutes(route.routes, {categoryId})}</div> :
      <NotFound text="Category Not Found" />
  ) : (
    <NotFound text="Loading Category ..." />
  )
}

Category.propTypes = {
  categories: PropTypes.array.isRequired,
  categoriesReceived: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryId: PropTypes.string.isRequired
    })
  }),
  route: PropTypes.object.isRequired
}

const mapStateToProps = ({ categories }) => ({ 
  categories: categories.items,
  categoriesReceived: categories.received
})

export default connect(mapStateToProps)(Category)