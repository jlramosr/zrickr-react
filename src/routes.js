import App from './components/app'
import Dashboard from './components/dashboard'
import Category from './components/category'
import CategoryList from './components/category/list'
import CategoryItemDetail from './components/category/detail'

export default [{
  component: App,
  exact: true,
  routes: [
    { path: '/', exact: true, component: Dashboard },
    { path: '/:categoryId', component: Category, routes: [
      { path: '/:categoryId', exact: true, component: CategoryList },
      { path: '/:categoryId/:postId', component: CategoryItemDetail }
    ]}
  ]
}]