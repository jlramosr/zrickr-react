import React from 'react'
import ReactDOM from 'react-dom'
import { renderRoutes } from 'react-router-config'
import { MuiThemeProvider } from 'material-ui/styles'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
//import PendingNavDataLoader from './pendingNavDataLoader'
import store, { history } from './store'
import routes from './routes'
import theme from './theme'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {
          //<PendingNavDataLoader routes={routes} />*/
          renderRoutes(routes)
        }
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)

registerServiceWorker()
