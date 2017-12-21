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
    overflow: 'hidden'
  },
  gridList: {
    justifyContent: 'center',
    maxWidth: 2800,
    textTransform: 'capitalize'
  },
  gridTile: {
    height: '280px !important'
  },
  gridImage: {
    width: 250,
    height: 250,
    objectFit: 'cover'
  }
})

class Dashboard extends Component  {

  computeNumCols = () => {
    switch (this.props.windowSize) {
      case 'small': return 1
      case 'medium': return 2
      case 'large': return 4
      default: return 2
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

    return (
      <HeaderLayout
        title={appName}
        loading={isFetchingCategories}
        operations={[
          {id:'menu', icon: MenuIcon, onClick: () => toggleDrawer(!drawerOpen)}
        ]}
      >

        {isReceivedCategories && (
          categories.length ? (
            <div className={classes.gridContainer}>
              <GridList cols={this.computeNumCols()} spacing={16} className={classes.gridList}>
                {categories.map(category => (
                  <GridListTile key={category.id} className={classes.gridTile}>
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
          ) : (
            <div className={classes.emptyContainer}>
              <span>There is no categories</span>
            </div>
          )
        )}
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