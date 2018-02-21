import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'strecht'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.primary.main,
    width: '100%',
    height: 60,
    color: '#fff',
    fontSize: 26,
    padding: 8
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 26
  },
  signIn: {
    fontSize: 14
  },
  contentHeadline: {
    height: 160,
    width: '100%',
    background: theme.palette.secondary.extraLight,
    margin: '0 auto'
  },
  contentDescription: {
    display: 'flex',
    flex: 1,
    margin: '0 auto'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ddd',
    width: '100%',
    height: 40
  }
})

class Product extends Component  {

  render = () => {
    const { appName, classes, history } = this.props

    return (
      <section className={classes.root}>
        <header className={classes.header}>
          <span className={classes.title}>{appName}</span>
          <button className={classes.signIn} onClick={() => { history.push('/account') }}>
            Sign In
          </button>
        </header>
        <section className={classes.contentHeadline}>
          <span>{process.env.REACT_APP_HEADLINE}</span>
        </section>
        <section className={classes.contentDescription}>
          <span>Description</span>
        </section>
        <footer className={classes.footer}>
          <p>&copy;{new Date().getFullYear()} {appName}</p>
        </footer>
      </section>
    )
  }
}

Product.propTypes = {
  appName: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired 
}

const mapStateToProps = ({ app }) => ({
  appName: app.name
})

export default connect(mapStateToProps, null)(
  withStyles(styles)(Product)
)