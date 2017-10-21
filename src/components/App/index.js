import React, { Component } from 'react'
import { Route } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchCategories } from '../../actions/categories'
import Category from '../category'
import Dashboard from '../dashboard'
import NotFound from '../notFound'
import Drawer from '../drawer'

class App extends Component {
  componentDidMount = _ => this.props.fetchCategories()

  render = _ => {
    const { categories } = this.props

    return (
      <div>
        
        <Drawer />

        <Route path="/" exact component={Dashboard} />

        <Route path="/:categoryId" component={ props => {
          const categoryId = props.match.params.categoryId
          const category = categories.find(
            category => category.id === categoryId
          )
          return category ? 
            React.createElement(Category, { 
              id: categoryId,
              label: category.label,
            }) : 
            React.createElement(NotFound, {title: 'Not Found'})
        }}/>

      </div>
    )
  }
}

App.propTypes = {
  categories: PropTypes.array.isRequired,
  fetchCategories: PropTypes.func.isRequired,
}

const mapStateToProps = ({categories}) => ({
  categories: [...categories.items] 
})

const mapDispatchToProps = dispatch => ({
  fetchCategories: _ => dispatch(fetchCategories()),
})

export default connect(mapStateToProps,mapDispatchToProps)(App)
