import React, { Component } from 'react'
import { createMuiTheme } from 'material-ui/styles'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import configureStore, { history } from '../src/store'

const { store } = configureStore()

export default class Wrapper extends Component {
  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme({})}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {this.props.children}
          </ConnectedRouter>
        </Provider>
      </MuiThemeProvider>
    )
  }
}
