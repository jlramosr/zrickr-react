import React from 'react'
import Switch from 'react-router/Switch'
import Redirect from 'react-router/Redirect'
import Route from 'react-router/Route'

import App from './components/app'
import Dashboard from './components/dashboard'
import Account from './components/account'
import Category from './components/category'
import Product from './components/product'
import NotFound from './components/notFound'

export default logged => {

  if (logged) {
    return (
      <React.Fragment>
        <Route path="*" component={App} />
        <Switch>
          <Redirect exact from="/" to="/dashboard" />
          <Redirect exact from="/product" to="/dashboard" />
          <Route exact path="/dashboard" component={Dashboard} />
          <Redirect from="/dashboard" to="/dashboard" />
          <Route exact path="/account" component={Account} />
          <Redirect from="/account" to="/account" />
          <Route exact path="/section/:categoryId" component={Category} />
          <Route exact path="/section/:categoryId/:itemId" component={Category} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/product" component={Product} />
        <Redirect from="/product" to="/product" />
        <Route exact path="/account" component={Account} />
        <Redirect from="/account" to="/account" />
        <Redirect from="/" to="/product" />
        <Route exact path="*" component={NotFound} />
      </Switch>
    </React.Fragment>
  )

}