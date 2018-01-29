import App from './components/app'
import Dashboard from './components/dashboard'
import Category from './components/category'

export default [{
  component: App,
  routes: [
    { path: '/', exact: true, component: Dashboard },
    { path: '/section/:categoryId', exact: true, component: Category },
    { path: '/section/:categoryId/:itemId', exact: true, component: Category }
  ]
}]