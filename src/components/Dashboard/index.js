import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { toggleDrawer } from '../../actions/interactions'
import HeaderLayout from '../headerLayout'
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import InfoIcon from 'material-ui-icons/Info'
import MenuIcon from 'material-ui-icons/Menu'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  emptyContainer: {
    padding: theme.spacing.unit*5
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: theme.spacing.unit*2
  },
  gridList: {
    justifyContent: 'center',
    width: '100%',
    maxWidth: 2520,
    textTransform: 'capitalize'
  },
  gridTile: {
    '& :hover': {
      opacity: 0.95
    }
  },
  gridImage: {
    maxWidth: 560,
    height: 'auto',
    objectFit: 'cover'
  }
})

class Dashboard extends Component  {

  computeColsRows = () => {
    switch (this.props.windowSize) {
      case 'xs': return {c:1,r:1}
      case 'sm': return {c:2,r:1}
      case 'md': return {c:3,r:1}
      case 'lg': return {c:4,r:1}
      case 'xl': return {c:5,r:2}
      default: return {c:2,r:1}
    }
  }

  render = () => {
    const {
      appName,
      categories,
      isFetchingCategories,
      isReceivedCategories,
      drawerOpen,
      toggleDrawer,
      classes
    } = this.props

    if (!isReceivedCategories) {
      return (
        <div className={classes.emptyContainer}>
          <span>Loading categories ...</span>
        </div>
      )
    }

    if (!categories.length) {
      return (
        <div className={classes.emptyContainer}>
          <span>There is no categories</span>
        </div>
      )
    }

    return (
      <HeaderLayout
        title={appName}
        loading={isFetchingCategories}
        operations={[
          {id:'menu', icon: MenuIcon, onClick: () => toggleDrawer(!drawerOpen)}
        ]}
      >
        <div className={classes.gridContainer}>
          <GridList cols={this.computeColsRows().c} spacing={16} className={classes.gridList}>
            {categories.map(category => (
              <GridListTile key={category.id} className={classes.gridTile} rows={this.computeColsRows().r}>
                <Link key={category.id} to={`/${category.id}`}>
                  <img
                    className={classes.gridImage}
                    src={category.image || 'https://blogs.ntu.edu.sg/files/2014/07/change_default_category.jpg'}
                    alt={category.label}
                  />
                  <GridListTileBar
                    title={category.label || ''}
                    subtitle={<span>{category.description}</span>}
                    actionIcon={
                      <IconButton>
                        <InfoIcon color="contrast" />
                      </IconButton>
                    }
                  />
                </Link>
              </GridListTile>
            ))}
          </GridList>
        </div>
      </HeaderLayout>
    )
  }
}

Dashboard.propTypes = {
  appName: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  isFetchingCategories: PropTypes.bool.isRequired,
  isReceivedCategories: PropTypes.bool.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ app, categories, interactions }) => ({
  appName: app.name,
  categories: Object.values(categories.byId), 
  isFetchingCategories: categories.flow.isFetchingAll,
  isReceivedCategories: categories.flow.isReceivedAll,
  drawerOpen: interactions.drawerOpen,
  windowSize: interactions.windowSize
})

const mapDispatchToProps = dispatch => ({
  toggleDrawer: opened => dispatch(toggleDrawer(opened))
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(Dashboard)
)