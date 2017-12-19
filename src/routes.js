import App from './components/app'
import Dashboard from './components/dashboard'
import Category from './components/category'
import CategoryList from './components/category/list'
import CategoryItemDetailHeader from './components/category/detail/headerLayout'

export default [{
  component: App,
  routes: [
    { path: '/', exact: true, component: Dashboard },
    { path: '/:categoryId', component: Category, routes: [
      { path: '/:categoryId', exact: true, component: CategoryList },
      { path: '/:categoryId/:itemId', exact: true, component: CategoryItemDetailHeader }
    ]}
  ]
}]