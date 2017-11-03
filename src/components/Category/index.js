import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import NotFound from '../notFound'

let Category = props => {
  const {
    categories,
    categoriesReceived,
    items,
    fields,
    settings,
    match,
    route 
  } = props
  const categoryId = match.params.categoryId
  const category = categories.find(category => category.id === categoryId)
  return categoriesReceived ? (
    category ? (
      <div>
        {renderRoutes(route.routes, {
          categoryId,
          items,
          fields,
          settings,
        })}
      </div> 
    ) : (
      <NotFound text="Category Not Found" />
    )
  ) : (
    <NotFound text="Loading Categories ..." />
  )
}

Category.propTypes = {
  categories: PropTypes.array.isRequired,
  categoriesReceived: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
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

export default connect(mapStateToProps)(Category)