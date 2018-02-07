import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchItems, fetchItemsIfNeeded } from './actions/items'

class PendingNavDataLoader extends Component {
  state = {
    previousLocation: null
  }

  componentWillReceiveProps(nextProps) {
    const navigated = nextProps.location !== this.props.location

    if (navigated) {
      // save the location so we can render the old screen
      this.setState({previousLocation: this.props.location})
      this.props.fetchItems('clients')
    }
  }

  render() {
    return (
      <React.Fragment>
        {renderRoutes(this.props.routes)}
      </React.Fragment>
    )
  }
}

// wrap in withRouter
const mapDispatchToProps = dispatch => ({
  fetchItems: category => dispatch(fetchItems(category)),
  fetchItemsIfNeeded: category => dispatch(fetchItemsIfNeeded(category))
})

export default withRouter(
  connect(null, mapDispatchToProps)(PendingNavDataLoader)
)