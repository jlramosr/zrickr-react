import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({

})

class Account extends Component  {
  render = () => {
    return (
      <div>accountaccountaccountaccountaccountaccountaccount</div>
    )
  }
}

Account.propTypes = {
}

const mapStateToProps = ({ interactions }) => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(Account)
)