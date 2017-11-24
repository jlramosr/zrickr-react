import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider } from 'material-ui/styles'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { renderRoutes } from 'react-router-config'
import store, { history } from './store'
import routes from './routes'
import theme from './theme'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {renderRoutes(routes)}
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)

registerServiceWorker()
