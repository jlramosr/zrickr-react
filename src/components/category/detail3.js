import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import { removeOpenRelation } from '../../actions/relations'

class CategoryItemDetailTabs extends Component {
  state = {
    value: 0
  }

  _handleRequestClose = () => {
    console.log("HOLA")
    this.setState({isClosing: true, renderContent: false})
  }

  render = () => {
    const {
      children,
      openDialogs,
      removeOpenRelation,
      isChangingDialogs } = this.props
    const { value } = this.state

    const numActiveDialogs = openDialogs.length
    const currentDialogProps = numActiveDialogs ?
      openDialogs[numActiveDialogs-1] :
      {}

    console.log(currentDialogProps)
    //if (isChangingDialogs) return (<div>{"hola"}</div>)
    return (
      <React.Fragment>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {openDialogs.map(item => 
              <Tab label="Item One"/>
            )}
          </Tabs>
        </AppBar>
        {children}
      </React.Fragment>
    )
  }
}

CategoryItemDetailTabs.propTypes = {
  children: PropTypes.node.isRequired,
  openDialogs: PropTypes.array.isRequired
}

const mapStateToProps = ( {dialogs} ) => ({
  openDialogs: dialogs.openDialogs,
  isChangingDialogs: dialogs.isChanging
})

const mapDispatchToProps = (dispatch, props) => ({
  removeOpenRelation: () => dispatch(removeOpenRelation())
})

export default connect(mapStateToProps,mapDispatchToProps)(CategoryItemDetailTabs)