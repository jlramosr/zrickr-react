import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { removeItem } from '../../actions/items'
import { fetchCategoriesIfNeeded } from '../../actions/categories'
import { fetchSettings, fetchSettingsIfNeeded } from '../../actions/settings'
import { fetchFields, fetchFieldsIfNeeded } from '../../actions/fields'
import { notify } from '../../actions/interactions'
import { capitalize } from '../../utils/helpers'
import ConfirmationDialog from '../dialog/confirmation'
import NotFound from '../notFound'

class Category extends Component {
  state = {
    showRemoveDialog: false,
    itemIdToRemove: null
  }

  componentWillMount = () => {
    this.props.fetchCategoriesIfNeeded()
    //this.props.fetchSettings()
    this.props.fetchSettingsIfNeeded()
    //this.props.fetchFields()
    this.props.fetchFieldsIfNeeded()
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

  onRemoveItem = itemId => {
    this.setState({showRemoveDialog: true, itemIdToRemove: itemId})
  }

  removeItem = () => {
    const { itemLabel, removeItem, notify, match, history } = this.props
    const categoryId = match.params.categoryId
    return removeItem(this.state.itemIdToRemove).then(
      () => {
        notify(`${capitalize(itemLabel)} removed succesfully`, 'success')
        if (history.location.pathname !== `/${categoryId}`) {
          history.push(`/${categoryId}`)
        }
      }, error => {
        notify(`There has been an error removing the ${itemLabel.toLowerCase()}: ${error}`, 'error')
      }
    )
  }

  render = () => {
    const { categories, categoriesReceived, itemLabel, match, route } = this.props
    const { showRemoveDialog } = this.state
    const categoryId = match.params.categoryId
    const category = categories.find(category => category.id === categoryId)

    if (!categoriesReceived) {
      return <NotFound text="Loading Categories ..." />
    }

    if (!category) {
      return <NotFound text="Category Not Found" />
    }
    
    return (
      <React.Fragment key={categoryId}> 
        {renderRoutes(route.routes, {
          categoryId,
          categoryLabel: category.label,
          onRemoveItem: this.onRemoveItem
        })}

        <ConfirmationDialog
          open={showRemoveDialog}
          message={`Are you sure to want to remove this ${itemLabel}?`}
          onAccept={() => {
            this.removeItem()
          }}
          onClose={() => {
            this.setState({showRemoveDialog: false, itemIdToRemove: null})
          }}
        />



      </React.Fragment>
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

const mapStateToProps = ({ categories, items, settings }, props) => {
  const categoryId = props.match.params.categoryId
  const category = categories.byId[categoryId]
  const categorySettings = category && category.settings ? settings.byId[category.settings] : {}
  const itemLabel = categorySettings.itemLabel || ''
  return {
    categories: Object.values(categories.byId),
    categoriesReceived: categories.flow.isReceivedAll,
    itemLabel
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.match.params.categoryId
  return {
    notify: (message, type) => dispatch(notify(message, type)),
    removeItem: itemId => dispatch(removeItem(categoryId,itemId)),
    fetchCategoriesIfNeeded: () => dispatch(fetchCategoriesIfNeeded()),
    fetchSettings: () => dispatch(fetchSettings(categoryId)),
    fetchSettingsIfNeeded: () => dispatch(fetchSettingsIfNeeded(categoryId)),
    fetchFields: () => dispatch(fetchFields(categoryId)),
    fetchFieldsIfNeeded: () => dispatch(fetchFieldsIfNeeded(categoryId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)