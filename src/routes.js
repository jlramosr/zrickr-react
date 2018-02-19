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
        <Route exact path="/" component={App} />
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Redirect exact from="/" to="/dashboard" />
          <Route exact path="/account" component={Account} />
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
        <Route exact path="/account" component={Account} />
        <Redirect exact from="/" to="/product" />
        <Route exact path="*" component={NotFound} />
      </Switch>
    </React.Fragment>
  )

}